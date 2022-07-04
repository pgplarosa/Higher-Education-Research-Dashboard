# Imports
import matplotlib.pyplot as plt
import numpy as np
import os
import pickle

# Constants
school_mapping = {
    0 : 'ASIST-Main',
    1 : 'ASIST-Bangued',
    2 : 'ASSCAT-Main',
    3 : 'BSU-Main',
    4 : 'BSU-La Trinidad',
    5 : 'BulSU-Main', 
    6 : 'DNSC-Main', 
    7 : 'MinSU-Calapan',
    8 : 'MinSU-Main', 
    9 : 'RSU-Main', 
    10 : 'UP-Baguio'
}

def dump(fname, data):
    if fname in os.listdir('./plots/fig_data/'):
        raise Exception('Duplicate filename: change fname')
    
    with open(f'plots/fig_data/{fname}', 'wb') as f:
        pickle.dump(data, f)

def random_color_func(word=None, font_size=None, position=None, 
                      orientation=None, font_path=None, random_state=None):
    h = int(360.0 * 45.0 / 255.0)
    s = int(100.0 * 255.0 / 255.0)
    l = int(100.0 * float(random_state.randint(60, 120)) / 255.0)

    return "hsl({}, {}%, {}%)".format(120, 100, 40)

def plot_lsa(x, p, feat_names, title):
    """ Plots the reults of LSA
    Plots the following:
    axes[0]    :   scatter plots of first two singular vectors (SVs)
    axes[1]    :   Arrows with feature names that represents the weights 
                   of first two singular vectors (SVs)
    axes[2]    :   Bar plot of the first singular vector
    axes[3]    :   Bar plot of the second singular vector

    Parameters
    ----------
    x          :   numpy.ndarray
                   X_new from SVD 
    p          :   numpy.ndarray
                   principal components
    feat_names :   list 
                   feature names from the columns of BoW representation 
                   of our dataset
    """
    fig, axes = plt.subplots(1, 1)
    norm = ((p[:, 0] - p[:, 1])**2)
    ind = np.argsort(norm, axis=0)[-15:]
    for feature, vec in zip(feat_names.columns[ind], p[ind]):
        axes.arrow(0, 0, vec[0]*1.5, vec[1]*1.5, width=0.01, ec='none', 
                   color='green')
        axes.text(vec[0]*1.65, vec[1]*1.65, feature, ha='center',
                  fontsize=12)

    spines = ['right', 'top']
    [axes.spines[spine].set_visible(False) for spine in spines]
    axes.tick_params(axis='both', which='both', length=0)
    axes.set_xlabel('SV1', fontsize=16)
    axes.set_ylabel('SV2', fontsize=16)
    axes.set_title(title, fontsize=16)
    axes.tick_params(axis='x', labelsize=16)
    axes.tick_params(axis='y', labelsize=16)
    
    fig.tight_layout()
    
