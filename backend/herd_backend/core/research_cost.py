import re
import pandas as pd
import matplotlib.pyplot as plt
import sqlite3
from sqlalchemy import create_engine
from .utilities import DB_PATH, DB_PATH_TEST, CLEANED_DATA_PATH
import os

DB = DB_PATH

def get_research_cost_table(db_path=DB,
                        show=False):
    """ outputs a table with columns: title, author, university, budget, 
        funding agency, source, funding type
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    show         :      bool
                        print table if set to true
    
    Returns
    ===========
    get_research_cost_table    :   str
                                   json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT rp.research_title as Title,
           group_concat(au.author_name, ";") as Author,
           sc.school_name as University,
           rp.allocated_budget as Budget, 
           fa.fa_name as `Funding Agency`,
           bs.bs_name as Source, 
           ft.ft_name as `Funding Type`
    FROM research_profile rp
    LEFT OUTER JOIN author au
    on rp.author_id = au.author_id
    LEFT OUTER JOIN school sc
    on rp.school_id = sc.school_id
    LEFT OUTER JOIN funding_agency fa
    on rp.fa_id = fa.fa_id
    LEFT OUTER JOIN budget_source bs
    on rp.bs_id = bs.bs_id
    LEFT OUTER JOIN funding_type ft
    on rp.ft_id = ft.ft_id
    GROUP BY title, university, budget, `Funding Agency`, 
             source, `Funding Type`
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_research_cost_budget(db_path=DB,
                         top=10,
                         plot=False):
    """ get the top budget for research
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    top          :      int
                        top n 
    plot         :      bool
                        display plot if set to true

    Returns
    ===========
    get_research_cost_budget    :   str
                                    json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT rp.research_id as title, rp.allocated_budget
    FROM research_profile rp
    WHERE rp.allocated_budget IS NOT NULL
    GROUP BY title, rp.allocated_budget
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    df['allocated_budget'] = (df.allocated_budget.astype(str)
                                .str.split(';')
                                 .apply(lambda x: 
                                        sum([float(re.sub(r'[^0-9]','',i)) 
                                             for i in x])))
    
    df = df.sort_values(by='allocated_budget', ascending=False)[:top][::-1]
    df = df.set_index('title')
    if plot:
        df.plot.barh()
        plt.show()
    return df.to_json(orient='columns')

def get_research_cost_funding_type(db_path=DB,
                               plot=False):
    """ get the count of funding type as either commissioned or grant
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
    
    Returns
    ===========
    get_research_cost_table    :   str
                                   json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT ft.ft_name as funding_type,
           COUNT(ft.ft_name) as count
    FROM (SELECT ft_id FROM research_profile
          GROUP BY research_title, ft_id) rp
    LEFT OUTER JOIN funding_type ft
    on rp.ft_id = ft.ft_id
    WHERE rp.ft_id IS NOT NULL
    GROUP BY ft.ft_name
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    
    df = df.set_index('funding_type').T
    
    if plot:
        df.plot.barh()
        plt.show()

    return df.to_json(orient='columns')

def get_research_cost_funding_source(db_path=DB,
                                 plot=False):
    """ get the count of funding source of the research
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
    
    Returns
    ===========
    get_research_cost_funding_source    :   str
                                            json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT bs.bs_name as budget_source,
           COUNT(bs.bs_name) as count
    FROM (SELECT bs_id FROM research_profile
          GROUP BY research_title, bs_id) rp
    LEFT OUTER JOIN budget_source bs
    on rp.bs_id = bs.bs_id
    WHERE rp.bs_id IS NOT NULL
    GROUP BY bs.bs_name
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    df = df.set_index('budget_source')
    
    if plot:
        df.plot.barh()
        plt.show()

    return df.to_json(orient='columns')

def get_research_cost_budget_line(db_path=DB,
                              plot=False):
    """ get the yearly budget for research 
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
    
    Returns
    ===========
    get_research_cost_budget_line    :   str
                                         json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT rp.research_id as title, 
           rp.year as year, 
           rp.allocated_budget
    FROM research_profile rp
    WHERE rp.allocated_budget IS NOT NULL
    GROUP BY title, rp.year, rp.allocated_budget
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    df['allocated_budget'] = (df.allocated_budget.astype(str)
                                .str.split(';')
                                 .apply(lambda x: 
                                        sum([float(re.sub(r'[^0-9]','',i)) 
                                             for i in x])))
    
    df = df.sort_values(by='allocated_budget', ascending=False)
    df = df.set_index('title')
    df = df.groupby('year')['allocated_budget'].sum()
    df.index = df.index.astype(int)

    if plot:
        df.plot()
        plt.show()

    return df.to_json(orient='columns')
    
def get_research_cost_university_scatter(df=os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx')):
    df = pd.read_excel(df)
    univ = df[['University (Abbreviation)', 'Allocated Budget (PH Pesos) 1,000,000.00']]
    univ.columns = ['University', 'Budget']
    univ_counts = pd.DataFrame(univ.groupby('University')['University'].agg('count'))
    univ_counts = univ_counts.rename({'University':'Research Count'}, axis=1)

    univ_budget = pd.DataFrame(univ.groupby('University')['Budget'].agg('sum'))
    univ_budget = univ_budget.rename({'Budget':'Total Budget'}, axis=1)

    univ_final = univ_counts.join(univ_budget)
    univ_final['Ratio'] = univ_final['Total Budget']/univ_final['Research Count']
    univ_final['Ratio'] = univ_final['Ratio'].apply(lambda x: round(x))

    return univ_final.to_json(orient='columns')

def get_research_cost_region_scatter(df=os.path.join(CLEANED_DATA_PATH, 'research_profile_updated.xlsx')):
    df = pd.read_excel(df)    
    region = df[['Region', 'Allocated Budget (PH Pesos) 1,000,000.00']]
    region.columns = ['Region', 'Budget']
    region_counts = pd.DataFrame(region.groupby('Region')['Region'].agg('count'))
    region_counts = region_counts.rename({'Region':'Research Count'}, axis=1)

    region_budget = pd.DataFrame(region.groupby('Region')['Budget'].agg('sum'))
    region_budget = region_budget.rename({'Budget':'Total Budget'}, axis=1)

    region_final = region_counts.join(region_budget)
    region_final['Ratio'] = region_final['Total Budget']/region_final['Research Count']
    region_final['Ratio'] = region_final['Ratio'].apply(lambda x: round(x))

    return region_final.to_json(orient='columns')
