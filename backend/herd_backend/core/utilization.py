import re
import pandas as pd
import matplotlib.pyplot as plt
import sqlite3
from sqlalchemy import create_engine
from .utilities import DB_PATH, DB_PATH_TEST

# Set db path based on environment.
DB = DB_PATH # or DB_PATH_TEST

def get_utilization_table(db_path=DB,
                          show=False):
    """ outputs a table with columns: patent_filed, patent_type, status, 
        date_register, author, school
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_utilization_table    :   str
                                 json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT  ut.product_service as Product,
            ut.beneficiary as Beneficiary,
            ut.year as Year, 
            sc.school_name as University
    FROM utilization ut
    LEFT OUTER JOIN school sc
    ON ut.school_id = sc.school_id
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
        
    if show:
        display(df)

    return df.to_json(orient='columns')
    
def get_utilization_product_univ(db_path=DB,
                    plot=False):
    """ count the number of product/service type per university
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_utilization_product_univ    :   str
                                        json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT  ut.product_service as Product,
            sc.school_name as University
    FROM utilization ut
    LEFT JOIN school sc
    ON ut.school_id = sc.school_id
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df = pd.crosstab(df.University, 
                     df.Product).sort_index(ascending=False)
    
    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_utilization_product_univ_break(school_name,
                                 db_path=DB,
                                 show=False):
    """ count the number of product/service type for a university
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    show         :      bool
                        display table if set to true
                        
    Returns
    ===========
    get_utilization_product_univ    :   str
                                        json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = f"""
    SELECT  ut.product_service as Product,
            sc.school_name as University
    FROM utilization ut
    LEFT JOIN school sc
    ON ut.school_id = sc.school_id
    WHERE University = "{school_name}"
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df = pd.crosstab(df.University, 
                     df.Product).sort_index(ascending=False)
    
    
    df = df.T.sort_values(by=school_name, ascending=False)
    
    if show:
        display(df)
        
    return df.to_json(orient='columns')

def get_utilization_topics(db_path=DB,
                           top=10,
                           plot=False):
    """ get the top n utilization topics
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_utilization_topics    :   str
                                  json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT ut.Simplified as Topic, 
           COUNT(ut.Simplified) as Count
    FROM utilization ut
    GROUP BY ut.Simplified
    ORDER BY Count DESC
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Topic')[:top][::-1]

    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_utilization_beneficiaries(db_path=DB,
                                  top=10,
                                  plot=False):
    """ get the top n beneficiaries
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_utilization_beneficiaries    :   str
                                         json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT ut.beneficiary as Beneficiaries, 
           COUNT(ut.beneficiary) as Count
    FROM utilization ut
    GROUP BY ut.beneficiary
    ORDER BY Count DESC
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Beneficiaries')[:top][::-1]

    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_utilization_yearly(db_path=DB,
                           plot=False):
    """ get the yearly utilization count
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_utilization_yearly    :   str
                                  json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT ut.year as Year, 
           COUNT(ut.year) as Count
    FROM utilization ut
    GROUP BY ut.year
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Year')

    if plot:
        df.plot()
        plt.show()
        
    return df.to_json(orient='columns')

# utilization_yearly = get_utilization_yearly(plot=True)
