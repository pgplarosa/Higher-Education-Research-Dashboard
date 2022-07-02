# import libraries
import pandas as pd
import matplotlib.pyplot as plt
import sqlite3
from sqlalchemy import create_engine
from .utilities import DB_PATH, DB_PATH_TEST

DB = DB_PATH

def get_research_relevance_table(db_path=DB,
                                 show=False):
    """ outputs a table with columns: title, author, university, journal, 
        year published, local/international, citations
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    show         :      bool
                        print table if set to true
                        
    Returns
    ===========
    get_research_relevance_table    :   str
                                        json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT rp.research_title as Title,
           GROUP_CONCAT(au.author_name, ";") as Author,
           sc.school_name as University,
           jo.journal_name as Journal, 
           jo.year_published as `Year Published`,
           jo.scope as Scope, 
           jo.no_citations as Citations
    FROM research_profile rp
    LEFT OUTER JOIN author au
    on rp.author_id = au.author_id
    LEFT OUTER JOIN school sc
    on rp.school_id = sc.school_id
    LEFT OUTER JOIN journal jo
    on rp.journal_id = jo.journal_id
    GROUP BY title, university, journal, year_published, scope, no_citations
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    if show:
        display(df)
    return df.to_json(orient='columns')


def get_research_relevance_scope(db_path=DB, plot=False):
    """ counts the number of local vs international published journal
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
    
    Returns
    ===========
    get_research_relevance_scope    :   str
                                        json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT jo.scope as scope, COUNT(*) as count
    FROM (SELECT journal_id FROM research_profile
          GROUP BY research_title, journal_id) rp
    LEFT JOIN journal jo
    on rp.journal_id = jo.journal_id
    WHERE jo.scope IS NOT NULL
    GROUP BY scope 
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    df = df.set_index('scope')
    if plot:    
        df.plot.barh()
        plt.show()

    return df.to_json(orient='columns')


def get_research_relevance_citations(db_path=DB, 
                                     plot=False):
    """ counts the number of citations per SUC
    
    Parameters
    ===========
    db_path      :      str
                        path of sqlite database
    plot         :      bool
                        display plot if set to true
                        
    Returns
    ===========
    get_research_relevance_citations    :   str
                                            json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT sc.school_name as university,
           SUM(jo.no_citations) as citations
    FROM (SELECT school_id, journal_id FROM research_profile
          GROUP BY research_title, school_id, journal_id) rp
    LEFT OUTER JOIN school sc
    on rp.school_id = sc.school_id
    LEFT OUTER JOIN journal jo
    on rp.journal_id = jo.journal_id
    WHERE jo.no_citations IS NOT NULL
    GROUP BY university
    ORDER BY citations ASC
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn).set_index('university')
    
    if plot:    
        df.plot.barh()
        plt.show()

    return df.to_json(orient='columns')
