import re
import pandas as pd
import matplotlib.pyplot as plt
import sqlite3
from sqlalchemy import create_engine
from .utilities import DB_PATH, DB_PATH_TEST, CLEANED_DATA_PATH
import os

DB = DB_PATH

def get_regional_development_table(db_path=DB,
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
    get_regional_development_table    :   str
                                          json string
    """
    engine = create_engine('sqlite:///' + db_path)
    query = """
    SELECT rp.research_title as Title,
           sc.school_name as University,
           group_concat(au.author_name, ";") as Author,
           rp.neda_id, 
           rp.sdg_id
    FROM research_profile rp
    LEFT OUTER JOIN author au
    on rp.author_id = au.author_id
    LEFT OUTER JOIN school sc
    on rp.school_id = sc.school_id
    GROUP BY title, university, rp.neda_id, rp.sdg_id
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    if show:
        display(df)
    return df.to_json(orient='columns')

def get_sdg_topics_table(df=os.path.join(CLEANED_DATA_PATH, 'sdg_topics.xlsx')):
    df = pd.read_excel(df)
    return df.to_json(orient='columns')    