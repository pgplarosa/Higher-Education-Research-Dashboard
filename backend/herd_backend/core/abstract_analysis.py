import json
import numpy as np
import pandas as pd
import os

from .utilities import CLEANED_DATA_PATH

def get_abstract_analysis_table(show=False):
    """ outputs a table with columns: Title, Author, Keywords, Abstract, Year, 
    University, Region, SDG, and Topic
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_abstract_analysis_table    :   str
                                       json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    df = df[['Research Title', 'Author', 'Keywords', 'Abstract', 'Year (YYYY)',
                'University (Full Name)', 'Region', 'SDG', 'Topic Name']]
    df['Keywords'] = pd.read_csv(os.path.join(CLEANED_DATA_PATH, 'keywords.csv'))
    df.columns = ['Title', 'Author', 'Keywords', 'Abstract', 'Year', 'University',
                  'Region', 'SDG', 'Topic']
    df['Topic'] = df['Topic'].replace('Outliers', np.nan)

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_by_suc(show=False):
    """ counts the topics per SUC
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_research_by_suc    :   str
                               json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    temp = sorted(df['University (Abbreviation)'].value_counts().drop('PSU').head(9).index)
    temp1 = df[['Topic Name']].value_counts().reset_index()['Topic Name'].values
    df = (df[['University (Abbreviation)', 'Topic Name']]
                       .groupby(['University (Abbreviation)', 'Topic Name']).size()
                       .to_frame().reset_index())
    df.columns = ['University', 'topics', 'count']
    df = df.pivot(index='University', columns='topics', values='count').fillna(0)
    df = df.loc[temp, temp1].drop('Outliers', axis=1)
    df.index.rename('University', inplace=True)

    if show:
        display(df)
    return df.to_json(orient='columns')


def get_top_10_topics(show=False):
    """ returns top 10 topics per SUC
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_top_10_topics    :   str
                             json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    df = df['Topic Name'].value_counts(ascending=True).drop('Outliers').to_frame()

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_by_sdg(show=False):
    """ counts the topics per SUC
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_research_by_sdg    :   str
                               json string
    """
    sdgs = {1: 'No Poverty', 2: 'No Hunger', 3: 'Good Health and Well-being',
            4: 'Quality Education', 5: 'Gender Equality',
            6: 'Clean Water and Sanitation', 7: 'Affordable and Clean Energy',
            8: 'Decent Work and Economic Growth',
            9: 'Industry, Innovation and Infrastructure',
            10: 'Reduced Inequality', 11: 'Sustainable Cities and Communities',
            12: 'Responsible Consumption and Production', 13: 'Climate Action',
            14: 'Life Below Water', 15: 'Life on Land',
            16: 'Peace, Justice, and Strong Institutions',
            17: 'Partnerships for the Goals'}
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    temp1 = (df[['Topic Name']].value_counts()
             .drop(['Covid-19 Pandemic', 'Outliers'])
             .reset_index()['Topic Name'].values)
    df = df[['SDG', 'Topic Name']].dropna()
    df['SDG'] = (df['SDG'].apply(
        lambda x: x.split('; ') if isinstance(x, str) else x))
    df = df.explode('SDG')
    df['SDG'] = df['SDG'].astype(int).map(sdgs)
    df = (df[df['Topic Name'] != 'Outliers']
          .groupby(['SDG', 'Topic Name']).size().to_frame().reset_index())
    df.columns = ['SDG', 'topics', 'count']
    df = df.pivot(index='SDG', columns='topics', values='count').fillna(0)
    df = df.loc[list(sdgs.values()), temp1]

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_by_region(show=False):
    """ counts the topics per SUC
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_research_by_region    :   str
                               json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    temp = ['CAR', '3', '4B', '11', '13']
    temp1 = df[['Topic Name']].value_counts().reset_index()['Topic Name'].values
    df = (df[['Region', 'Topic Name']].groupby(['Region', 'Topic Name']).size()
          .to_frame().reset_index())
    df['Region'] = df['Region'].astype(str)
    df.columns = ['Region', 'topics', 'count']
    df = df.pivot(index='Region', columns='topics', values='count').fillna(0)
    df = df.loc[temp, temp1].drop('Outliers', axis=1)

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_by_agency(show=False):
    """ counts the topics per agency
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_research_by_agency    :   str
                                  json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    temp = df[['Funding Agency', 'Topic Name']].dropna()
    temp['Funding Agency'] = df['Funding Agency'].str.split('; ')
    temp = temp.explode('Funding Agency')
    temp = temp[temp['Topic Name'] != 'Outliers']
    temp = temp[temp['Funding Agency'] != 'Personal']
    temp = temp['Funding Agency'].value_counts().head(15).index
    temp1 = df[['Topic Name']].value_counts()
    temp1.drop('Outliers', inplace=True)
    temp1 = temp1.reset_index()['Topic Name'].values
    df = df[['Funding Agency', 'Topic Name']].dropna()
    df['Funding Agency'] = df['Funding Agency'].str.split('; ')
    df = df.explode('Funding Agency')
    df = (df[df['Topic Name'] != 'Outliers']
          .groupby(['Funding Agency', 'Topic Name']).size().to_frame().reset_index())
    df.columns = ['Funding Agency', 'topics', 'count']
    df = df.pivot(index='Funding Agency', columns='topics', values='count').fillna(0)
    df = df.loc[temp, temp1]
    
    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_by_budget(show=False):
    """ counts the topics per budget
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
            
    Returns
    ===========
    get_research_by_agency    :   str
                                  json string
    """
    df = pd.read_excel(os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx'))
    df['Topic Name'] = df['Topic Name'].str.title()
    df = df[['Allocated Budget (PH Pesos) 1,000,000.00', 'Topic Name']].dropna()
    df['Allocated Budget (PH Pesos) 1,000,000.00'] = (
        df['Allocated Budget (PH Pesos) 1,000,000.00']
        .apply(lambda x: x.split('; ') if isinstance(x, str) else x))
    df = df.explode('Allocated Budget (PH Pesos) 1,000,000.00')
    df = df[df['Topic Name'] != 'Outliers']
    df['Allocated Budget (PH Pesos) 1,000,000.00'] = (
        df['Allocated Budget (PH Pesos) 1,000,000.00']
        .apply(lambda x: x.replace(',','') if isinstance(x, str) else x)
        .astype(float))
    df = df[df['Allocated Budget (PH Pesos) 1,000,000.00'] > 0]
    df = (df.groupby('Topic Name')['Allocated Budget (PH Pesos) 1,000,000.00'].sum())
    df = df.sort_values().to_frame()
    df.columns = ['Total Allocated Budget']
    
    if show:
        display(df)
    return df.to_json(orient='columns')

def get_topic_keywords_table(show=False):
    """ show keywords for topics table
    
    Parameters
    ===========
    show         :      bool
                        print table if set to true
            
    Returns
    ===========
    get_topic_keywords_table    :   str
                                    json string
    """
    df = pd.read_csv(os.path.join(CLEANED_DATA_PATH, 'words_per_topic.csv'))
    
    if show:
        display(df)
    return df.to_json(orient='columns')