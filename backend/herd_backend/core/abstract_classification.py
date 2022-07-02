import pickle
import json
import pandas as pd
from sentence_transformers import util

from . utilities import MODELS_PATH, CLEANED_DATA_PATH

import os

def abstract_classification(abstract_text):
    """ Predict the school, topic, sdg, keywords given abstract
    
    Parameters
    ----------
    abstract_text   :   str
                        proposed abstract of the research
    
    Returns
    --------
    abstract_analysis  :  json
                          predicted values
    """
    school_mapping = {
        0 : 'Abra State Institute of Science and Technology (ASIST-Main)',
        1 : 'Abra State Institute of Science and Technology (ASIST-Bangued)',
        2 : 'Agusan del Sur State College of Agriculture and Technology (ASSCAT-Main)',
        3 : 'Benguet State University (BSU-Main)',
        4 : 'Benguet State University (BSU-La Trinidad)',
        5 : 'Bulacan State University (BulSU-Main)', 
        6 : 'Davao del Norte State College (DNSC-Main)', 
        7 : 'Mindoro State University (MinSU-Calapan)',
        8 : 'Mindoro State University (MinSU-Main)', 
        9 : 'Romblon State University (RSU-Main)', 
        10 : 'University of the Philippines Baguio (UP-Baguio)'
    }
    
    topic_mapping = {
       -1 : 'Outliers',
        0 : 'COVID-19 PANDEMIC',      
        1 : 'EDUCATION',
        2 : 'BIODIVERSITY / CONSERVATIONISM',
        3 : 'AQUACULTURE / FISHERIES',
        4 : 'LIVESTOCK AGRICULTURE',
        5 : 'CROP CULTIVATION',
        6 : 'DATA SCIENCE / COMPUTER VISION',
        7 : 'UTILITIES / TRANSPORTATION',
        8 : 'GOVERNANCE / POLICY',
        9 : 'INDIGENOUS PEOPLE / TRADITION AND HISTORY'
    }
    
    # embeddings
    with open(os.path.join(MODELS_PATH, 'specter.pickle'), 'rb') as f:
        encoder = pickle.load(f)

    # classifier (school)
    with open(os.path.join(MODELS_PATH, 'research_spec.pickle'), 'rb') as f:
        research_spec = pickle.load(f)   
        
    # tfid vectorizer (keyphrase generation)
    with open(os.path.join(MODELS_PATH, 'tfidf_vectorizer_keyphrase.pkl'), 'rb') as f:
        tfidf_vect = pickle.load(f)    

    # classifier (sdg)
    with open(os.path.join(MODELS_PATH, 'sdg_lr.pkl'), 'rb') as f:
        sdg_lr = pickle.load(f)  
    
    # classifier (school)
    with open(os.path.join(MODELS_PATH, 'topics.pickle'), 'rb') as f:
        topics = pickle.load(f)   
        
    # keybert (keyphrase generation)
    with open(os.path.join(MODELS_PATH, 'kw_model_keyphrase.pkl'), 'rb') as f:
        keybert = pickle.load(f)
    
    # tfid vectorizer (keyphrase generation)
    with open(os.path.join(MODELS_PATH, 'tfidf_vectorizer_keyphrase.pkl'), 'rb') as f:
        tfidf_vect = pickle.load(f)

    # dataframe db for similarity
    author_sim_db = pd.read_csv(os.path.join(CLEANED_DATA_PATH, 'author_sim_db.csv')) 

    # embeddings db for similarity
    with open(os.path.join(CLEANED_DATA_PATH, 'abs_embed_db.pickle'), 'rb') as f:
        abs_embed_db = pickle.load(f)        
        
    # uncased since encoder is pretrained uncased
    abstract_text= (abstract_text.lower()
                          .replace('“', '')
                          .replace(':', '')
                          .replace('(', '')
                          .replace(')', ''))
    
    
    embeddings = encoder.encode(abstract_text)
    pred_research_spec = research_spec.predict(embeddings.reshape(1, -1))
    predicted_school = school_mapping[pred_research_spec[0]]
    
    tfidf_vect.fit_transform([abstract_text]).toarray()
    predicted_keyphrase = keybert.extract_keywords(docs=[abstract_text], 
                                                   vectorizer=tfidf_vect)
    predicted_keyphrase = (", ").join([phrase[0] for phrase 
                                       in predicted_keyphrase[0]])
    
    predicted_sdg = str(sdg_lr.predict(embeddings.reshape(1, -1))[0])
    
    predicted_topic = topics.predict(embeddings.reshape(1, -1))[0]
    predicted_topic = topic_mapping[predicted_topic]

    scores = util.cos_sim(embeddings, abs_embed_db).numpy()
    arg_scores = scores[0].argsort(kind='mergesort')[::-1]
    top_n_sim = author_sim_db.iloc[arg_scores[:1], :]
    
    sim_research = top_n_sim['Research Title'].values[0]
    sim_author = top_n_sim.Author.values[0]
    
    return json.dumps({'predicted_school': predicted_school, 
                       'predicted_keyphrase': predicted_keyphrase,
                       'predicted_topic' : predicted_topic.title(),
                       'predicted_sdg' : predicted_sdg,
                       'similar_research' : sim_research,  
                       'author_with_similar_research' : sim_author})
