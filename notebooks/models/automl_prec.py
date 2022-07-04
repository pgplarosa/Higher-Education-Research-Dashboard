"""
##############################################################################
## Module Name: automl.py
## Created by: Patrick La Rosa
## Created on: 02/09/2021
##
##
##############################################################################
"""

# python standard libraries
from datetime import datetime
import time
import sys

# data processing
import pandas as pd
import numpy as np
from tqdm import tqdm

# plotting
from pandas.plotting import scatter_matrix
from matplotlib import cm
import seaborn as sns
import matplotlib.patches as mpatches
import pylab as plot
import matplotlib.pyplot as plt

# normalize
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler

# model selection
from sklearn.model_selection import train_test_split
from sklearn.model_selection import KFold
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import RepeatedStratifiedKFold
from sklearn.model_selection import RepeatedKFold
from sklearn.model_selection import ParameterGrid
from sklearn.model_selection import GridSearchCV

# ml models
# error based models
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Lasso
from sklearn.linear_model import Ridge
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.svm import SVC

# information based models
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier

# similarity based
from sklearn.neighbors import KNeighborsRegressor
from sklearn.neighbors import KNeighborsClassifier

# scoring metrics
from sklearn.metrics import r2_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score

# ignore warnings
import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=ConvergenceWarning)

class AutoML(object):
    def __init__(self, model_code):
        self.splits = []
        models = {
            # regressor
            # error based
            'lir' : [LinearRegression, 'Linear Regression'],
            'rdg' : [Ridge, 'Ridge Regression'],
            'lso' : [Lasso, 'Lasso Regression'],
            # information based
            'dtr' : [DecisionTreeRegressor, 'Decision Tree'], 
            'rfr' : [RandomForestRegressor, 'Random Forest'], 
            'gbr' : [GradientBoostingRegressor, 'GradientBoost'],
            
            'knr' : [KNeighborsRegressor, 'knn Regression'],

            # classifier
            # error based
            'log' : [LogisticRegression, 'Logistic Regression'],
            'svl' : [LinearSVC, 'Linear SVM'],
            'svm' : [SVC, 'SVM'],
            
            # information based
            'dtc' : [DecisionTreeClassifier, 'Decision Tree'],
            'rfc' : [RandomForestClassifier, 'Random Forest'],
            'gbc' : [GradientBoostingClassifier, 'Gradient Boost'], 
            # similarity based
            'knc' : [KNeighborsClassifier, 'knn Classification'],    
        }
        # multiple train
        self.summs = None
        self.test_model = None
        if isinstance(model_code, list):
            if all(map(lambda x:x in models, model_code)):
                self.model_code = model_code
                self.model = [models[i][0] for i in model_code]
                self.model_name = [models[i][1] for i in model_code]
            else:
                raise ValueError('invalid model_code!')
        else:
            if model_code not in models.keys():
                raise ValueError('invalid model_code!')
            self.model_code = model_code
            self.model = models[model_code][0]
            self.model_name = models[model_code][1]
        # used only for appending for model_name
        self.append = True
        
    def split_data(self, X, y, random_state=1337, shuffle=True, 
                   method='train_test', num_trials=1, stratify=False, 
                   **kwargs):
        stratify_dict = {}
        if self.splits:
            return self.splits
        
        if method == 'train_test':
            if stratify:
                stratify_dict['stratify'] = y
                
            for i in range(num_trials):
                test_size = (0.2 if 'test_size' not in kwargs.keys() 
                             else kwargs['test_size'])

                (X_train, X_test, 
                 y_train, y_test) = train_test_split(X, y,
                                                    test_size=test_size,
                                                    random_state=i, 
                                                    shuffle=shuffle,
                                                    **stratify_dict)

                self.splits.append((X_train, X_test, y_train, y_test))
        elif method == 'kfold':
            n_splits = (8 if 'n_splits' not in kwargs.keys() 
                        else kwargs['n_splits'])
            if stratify:
                kf = StratifiedKFold(n_splits=n_splits, 
                                     shuffle=shuffle, 
                                     random_state=random_state)
                self.splits = [(X.iloc[i], X.iloc[j], 
                                y.iloc[i], y.iloc[j]) 
                               for (i, j) in kf.split(X, y)]
            else:
                kf = KFold(n_splits=n_splits, shuffle=shuffle, 
                           random_state=random_state)
                self.splits = [(X.iloc[i], X.iloc[j], 
                                y.iloc[i], y.iloc[j]) 
                               for (i, j) in kf.split(X)]

        return self.splits
    
    def generate_summary(self,):
        if self.summs is not None:
            return self.summs
        return [self.model_name, self.test_score, self.best_param, 
                self.top_predictor, self.run_time]
    
    def plot_feature_importance(self, absol=True, sort=True):
        fig, ax = plt.subplots(figsize=(6,8))
        mean_coefs = self.mean_coefs.copy()
        feature_names = self.feature_names.copy()

        if absol:
            mean_coefs = np.abs(mean_coefs)
        
        if sort:
            feature_names = feature_names[np.argsort(np.abs(mean_coefs))]
            mean_coefs = sorted(np.abs(mean_coefs))
        ax.set_title(self.model_name)
        ax.barh(np.arange(self.coefs_count), mean_coefs)
        ax.set_yticks(np.arange(self.coefs_count))
        ax.set_yticklabels(feature_names)
    
    def plot_train_val(self, log_scale=False):
        # Initialize figure
        fig, ax = plt.subplots(figsize=(15, 6))
        plt.title(self.model_name, fontsize=16)
        values = [list(param.values())[0] for param in self.param_grid]
        
        if log_scale:
            plt.xscale('log')
            
        # Plot the spread of predictions
        ax.fill_between(
            values,
            (np.mean(self.score_train, axis=0) 
             + np.std(self.score_train, axis=0)),
            (np.mean(self.score_train, axis=0) 
             - np.std(self.score_train, axis=0)),
            color='tab:blue', alpha=0.10
        )
        ax.fill_between(
            values,
            (np.mean(self.score_test, axis=0) 
             + np.std(self.score_test, axis=0)),
            (np.mean(self.score_test, axis=0) 
             - np.std(self.score_test, axis=0)),
            color='tab:orange', alpha=0.10
        )
        # Plot mean of the predictions
        ax.plot(values, np.mean(self.score_train, axis=0), lw=3,
                label="training accuracy")
        ax.plot(values, np.mean(self.score_test, axis=0), lw=3,
                label="validation accuracy")
        
        plt.xlabel(list(self.param_grid[0].keys())[0])
        plt.legend()
        plt.ylabel('accuracy')
        
    def set_model_default_params(self, model):
        default_params = {
            'rfr' : {'n_jobs' : -1, 'n_estimators':50}, 
            'rfc' : {'n_jobs' : -1, 'n_estimators':50}, 
            'gbr' : {'n_estimators':50},
            'gbc' : {'n_estimators':50}
        }
        
        if self.model_code in default_params.keys():
            model.set_params(**default_params[self.model_code])
        
        elif self.model_code == 'log':
            if ('penalty' in self.fixed_params.keys() 
                and self.fixed_params['penalty'] == 'l1'):
                default_params = {'solver' : 'liblinear'}
            else:
                default_params = {'dual' : False}
        
            model.set_params(**default_params)
            if self.append:
                self.model_name = (f'{self.model_name} '
                                  f'({self.fixed_params["penalty"]})')  
                self.append = False
        
        elif self.model_code == 'svl':
            if ('penalty' in self.fixed_params.keys() 
                and self.fixed_params['penalty'] == 'l1'):
                default_params = {'loss' : 'squared_hinge', 'dual' : False}
                model.set_params(**default_params)
            if self.append:
                self.model_name = (f'{self.model_name} '
                                  f'({self.fixed_params["penalty"]})')  
                self.append = False
        
        return model
    
    def get_coefs(self, reg):
        if self.model_code in ['dtr', 'dtc', 
                               'rfr', 'rfc', 
                               'gbr', 'gbc']:
            coefs = reg.feature_importances_
        elif self.model_code in ['lir', 'rdg', 'lso', 'log', 'svl']:
            coefs = reg.coef_
        elif self.model_code in ['knr', 'knc']:
            coefs = None

        return coefs
    
    def train_model(self, X, y,
                    random_state=0, fixed_params={}, 
                    param_grid={'max_depth':range(2,11)}, 
                    normalize=False, plot_train_val=True, 
                    plot_feat_imp=True):
        if isinstance(self.model_code, list):
            self.train_models_multiple(X, y,
                    random_state, fixed_params, 
                    param_grid, 
                    normalize, plot_train_val, 
                    plot_feat_imp)
            return 
        
        start_time = time.time()
        score_train = []
        score_test = []
        weighted_coefs=[]
        param_grid = list(ParameterGrid(param_grid))
        model = self.model
        self.fixed_params = fixed_params
        self.normalize = normalize
        
        with tqdm(total=len(self.splits), file=sys.stdout, 
                  position=0, leave=True) as pbar:
            for split in self.splits:
                pbar.set_description(self.model_name)
                
                training_accuracy = []  
                test_accuracy = []
                X_train, X_test, y_train, y_test = split

                if normalize: 
                    # normalize the features
                    Scaler = normalize().fit(X_train)
                    X_train = Scaler.transform(X_train)
                    X_test = Scaler.transform(X_test)
                    
                if self.model_code in ['lir']:
                    mdl = model()
                    mdl.fit(X_train, y_train)
                    training_accuracy.append(precision_score(mdl.predict(X_train), y_train, average='macro'))
                    test_accuracy.append(precision_score(mdl.predict(X_test), y_test, average='macro'))
                    coefs = self.get_coefs(mdl)
                    weighted_coefs.append(coefs)
                else:
                    for param in param_grid:
                        try:
                            mdl = model(random_state=random_state, 
                                         **param)
                        except TypeError:
                            mdl = model(**param)

                        mdl = self.set_model_default_params(mdl)
                        try:
                            mdl.set_params(**fixed_params)
                        except KeyError:
                            pass

                        mdl.fit(X_train, y_train)

                        training_accuracy.append(precision_score(mdl.predict(X_train), y_train, average='macro'))
                        test_accuracy.append(precision_score(mdl.predict(X_test), y_test, average='macro'))

                        coefs = self.get_coefs(mdl)
                        weighted_coefs.append(coefs)
                pbar.update(1)

                score_train.append(training_accuracy)
                score_test.append(test_accuracy)

        # get the mean of the weighted coefficients over all the trials  
        mean_coefs = (None if self.model_code in ['knr', 'knc'] 
                      else np.mean(weighted_coefs, axis=0))
        mean_coefs = (None if self.model_code in ['knr', 'knc'] 
                      else (mean_coefs if mean_coefs.ndim == 1 
                            else mean_coefs.mean(axis=0)))
        score = np.mean(score_test, axis=0)
        top_predictor = ('NA' if self.model_code in ['knr', 'knc'] 
                         else X.columns[np.argmax(np.abs(mean_coefs))])
        
        # for plotting train and test accuracy
        self.score_train = score_train
        self.score_test = score_test
        self.param_grid = param_grid
        
        # for plotting feature importance
        self.mean_coefs = (None if self.model_code 
                           in ['knr', 'knc'] else mean_coefs)
        self.coefs_count = (None if self.model_code in ['knr', 'knc'] 
                            else len(self.mean_coefs)) 
        self.feature_names = X.columns
        
        # for summary
        self.test_score = np.amax(score)
        best_param = [f'{key} =  {value}' 
                      for key, value in param_grid[np.argmax(score)].items()]
        self.best_param = (';'.join(best_param) 
                           if self.model_code != 'lir' else 'NA')
        self.top_predictor = top_predictor
        self.run_time = (time.time() - start_time)
        
        # for score
        self.test_param = param_grid[np.argmax(score)]
        
        if plot_train_val:
            if self.model_code == 'lir':
                pass
            elif self.model_code not in ['log', 'svl']:
                self.plot_train_val()
            else:
                self.plot_train_val(log_scale=True)
        
        if plot_feat_imp:
            if self.model_code not in ['knr', 'knc']:
                self.plot_feature_importance()
    
    def train_models_multiple(self, X, y,
                              random_state=0, fixed_params={}, 
                              param_grid={'max_depth':range(2,11)}, 
                              normalize=False, plot_train_val=True, 
                              plot_feat_imp=True):
        """should have the same params"""
        model_codes = self.model_code
        models = self.model
        model_names = self.model_name
        summs = []
        for model_code, model, model_name in zip(model_codes, 
                                                 models, model_names):
            self.append = True
            self.model_code = model_code
            self.model = model
            self.model_name = model_name
            self.train_model(X, y, random_state, fixed_params, 
                            param_grid, 
                            normalize, plot_train_val, 
                            plot_feat_imp)
            summs.append(self.generate_summary())
            
        
        summs = pd.DataFrame(summs)
        summs.columns = ['Machine Learning Method', 'Test Precision', 
                         'Best Parameter', 'Top Predictor Variable', 
                         'Run Time']
        
        self.summs = summs
    
    def score(self, X, y):
        """ Works for single model only"""
        if self.test_model is None:
            X_train, X_test, y_train, y_test = self.splits[0]
            
            if self.normalize: 
                # normalize the features
                Scaler = self.normalize().fit(X_train)
                X_train = Scaler.transform(X_train)
                X_test = Scaler.transform(X_test)
                self.test_scaler = Scaler
            
            test_model = self.model()
            test_model = self.set_model_default_params(test_model)
            try:
                test_model.set_params(**self.fixed_params)
            except KeyError:
                pass

            test_model.set_params(**self.test_param)
            test_model.fit(X_train, y_train)
            self.test_model = test_model
        
        if self.normalize:
            X = self.test_scaler.transform(X)
        
        return precision_score(self.test_model.predict(X), y, average='macro')
        