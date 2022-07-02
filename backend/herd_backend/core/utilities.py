import json
from django.http import JsonResponse
import os


def process_for_response(raw_data, metadata=None):
    dict_data = json.loads(raw_data)
    processed = {column: list(dict_data[column].values()) for column in dict_data}
    if metadata:
        processed['metadata'] = metadata
    return processed

def get_columns(raw_data: str):
    return list(json.loads(raw_data).keys())

def convert_to_json(raw: str):
    return json.loads(raw)

def makeJsonResponse(response_body, metadata=None, is_modified=False):
    if is_modified:
        return JsonResponse(process_for_response(response_body, metadata), safe=False)

    return JsonResponse(convert_to_json(response_body), safe=False)

def invert_table(table, is_string=True, index_name = "default", preserve_index=False) -> dict:
    dict_table = table
    if is_string:
        dict_table = json.loads(table)

    columns = list(dict_table.keys())
    if preserve_index:
        columns = [index_name] + columns
    rows = by_row(dict_table, index_name, preserve_index)
    inverted_table = {
        "columns": columns,
        "rows": rows
    }

    return inverted_table

def by_row(table: dict, index_name, preserve_index) -> list:
    if not table:
        return []
    
    processed_table = {column: list(table[column].values()) for column in table}
    # import pdb; pdb.set_trace()
    
    row_count = len(processed_table[list(processed_table.keys())[0]])

    columns = list(processed_table.keys())
    universities = []
    if preserve_index:
        universities = list(table.get('Total Budget').keys())

    rows = []
    for index in range(0, row_count):
        new_row = {}
        for column in columns:
            new_row[column] = processed_table[column][index]
            if preserve_index:
                new_row[index_name] = universities[index]
        rows.append(new_row)

    if preserve_index:
        columns.append(index_name)
    return rows

def create_stacked_bar_chart_data(data, is_string=True):
    dict_data = data
    if is_string:
        dict_data = json.loads(data)
    
    stacked_bar_data = []
    groups = list(dict_data.keys())
    all_labels = list(dict_data[groups[0]].keys())

    for group in groups:
        new_data = {}
        new_data["labels"] = all_labels

        values = []
        for label in all_labels:
            values.append(dict_data[group][label])
        new_data["values"] = values
        new_data["name"] = group
        stacked_bar_data.append(new_data)
    
    return stacked_bar_data

# DB PATH FOR DEPLOYMENT
DB_PATH = os.path.abspath('../herd_backend/data/db.sqlite3')
MODELS_PATH = os.path.abspath('./core/models')
CLEANED_DATA_PATH = os.path.abspath('../herd_backend/data/cleaned')
SUC_NETWORK_PATH = os.path.abspath('./core/models/networks/suc_network.json')
FACULTY_NETWORK_PATH = os.path.abspath('./core/models/networks/faculty_network.json')

# DB PATH FOR TESTING
DB_PATH_TEST = '../data/db.sqlite3'