import re
import pandas as pd
import matplotlib.pyplot as plt
import sqlite3
from sqlalchemy import create_engine
from .utilities import DB_PATH, DB_PATH_TEST

# Set based on environment.
DB = DB_PATH # or DB_PATH_TEST

def get_patent_table(db_path=DB,
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
    get_patent_table    :   str
                            json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT  pt.patent_filed as `Patent Filed`,
            pt.patent_type as `Patent Type`,
            pt.patent_status as Status, 
            pt.date_register as `Registration Date`,
            pt.registration_number as `Registration Number`,
            GROUP_CONCAT(author_name, ";") as Author, 
            school_name as University
    FROM patent pt
    LEFT OUTER JOIN author au
    on pt.author_id = au.author_id
    LEFT OUTER JOIN school sc
    ON pt.school_id = sc.school_id
    GROUP BY `Patent Filed`, `Patent Type`, Status, 
             `Registration Date`, `Registration Number`, 
              University
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
        
    if show:
        display(df)
        
    return df.to_json(orient='columns')
    
def get_patent_type_univ(db_path=DB,
                    plot=False):
    """ count the number of research type per university
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_patent_type_univ    :   str
                                json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT  pt.patent_filed as `Patent Filed`,
            pt.patent_type as `Patent Type`,
            pt.patent_status as Status, 
            pt.date_register as `Registration Date`,
            pt.registration_number as `Registration Number`,
            GROUP_CONCAT(author_name, ";") as Author, 
            school_name as University
    FROM patent pt
    LEFT JOIN author au
    on pt.author_id = au.author_id
    LEFT JOIN school sc
    ON pt.school_id = sc.school_id
    GROUP BY `Patent Filed`, `Patent Type`, Status, 
             `Registration Date`, `Registration Number`, 
              University
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df = pd.crosstab(df.University, 
                     df['Patent Type']).sort_index(ascending=False)
    
    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_patent_type_univ_break(school_name, db_path=DB,
                               show=False):
    """ count the number of research type for university
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    show         :      bool
                        display table if set to true
                        
    Returns
    ===========
    get_patent_type_univ    :   str
                                json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = f"""
    SELECT  pt.patent_filed as `Patent Filed`,
            pt.patent_type as `Patent Type`,
            pt.patent_status as Status, 
            pt.date_register as `Registration Date`,
            pt.registration_number as `Registration Number`,
            GROUP_CONCAT(author_name, ";") as Author, 
            school_name as University
    FROM patent pt
    LEFT JOIN author au
    on pt.author_id = au.author_id
    LEFT JOIN school sc
    ON pt.school_id = sc.school_id
    WHERE University = "{school_name}"
    GROUP BY `Patent Filed`, `Patent Type`, Status, 
             `Registration Date`, `Registration Number`, 
              University
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df = pd.crosstab(df.University, 
                     df['Patent Type']).sort_index(ascending=False)
    
    df = df.T.sort_values(by=school_name, ascending=False)
    
    if show:
        display(df)
        
    return df.to_json(orient='columns')

def get_patent_type(db_path=DB,
                    plot=False):
    """ count the number of research type
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_patent_type    :   str
                           json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT patent_type AS `Patent Type`, 
           COUNT(patent_type) as Count
    FROM
    (
        SELECT patent_type
        FROM patent 
        GROUP BY patent_filed, patent_type
    )
    GROUP BY patent_type
    ORDER BY Count
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Patent Type')

    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_patent_status(db_path=DB,
                      plot=False):
    """ count the number of research status
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_patent_status    :   str
                             json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT patent_status AS `Patent Status`, 
           COUNT(patent_status) as Count
    FROM
    (
        SELECT patent_status
        FROM patent 
        GROUP BY patent_filed, patent_status
    )
    GROUP BY patent_status
    ORDER BY Count
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Patent Status')

    if plot:
        df.plot.barh()
        plt.show()
        
    return df.to_json(orient='columns')

def get_patent_yearly(db_path=DB,
                      plot=False):
    """ count the number of patents per year
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_patent_yearly    :   str
                             json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT SUBSTR(date_register, 1, 4) AS Year, 
           COUNT(*) as Count
    FROM
    (
        SELECT date_register
        FROM patent 
        GROUP BY patent_filed, date_register
    )
    GROUP BY Year
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('Year')

    if plot:
        df.plot()
        plt.show()
        
    return df.to_json(orient='columns')

# patent_yearly = get_patent_yearly(plot=True)
