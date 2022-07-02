from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.http import JsonResponse
from core.research_relevance import get_research_relevance_table as research_relevance_table
from core.research_relevance import get_research_relevance_scope as research_relevance
from core.research_relevance import get_research_relevance_citations as citations
from core.patent import get_patent_table as patents_table
from core.patent import get_patent_type_univ as patent_type_per_university
from core.patent import get_patent_type as patents_per_type
from core.patent import get_patent_status as patents_per_status
from core.patent import get_patent_yearly as patents_forecast
from core.abstract_classification import abstract_classification
from core.abstract_analysis import get_research_by_sdg, get_research_by_region, get_abstract_analysis_table, \
                                    get_research_by_suc, get_top_10_topics, get_research_by_agency, \
                                    get_research_by_budget, get_topic_keywords_table

from core.utilities import process_for_response, get_columns, convert_to_json, invert_table, create_stacked_bar_chart_data
from django.views.decorators.csrf import csrf_exempt


import json

def get_research_relevance_table(request):
    return JsonResponse(invert_table(research_relevance_table()), safe=False)

def get_research_relevance_scope(request):
    return JsonResponse(convert_to_json(research_relevance()), safe=False)

def get_citations(request):
    return JsonResponse(convert_to_json(citations()), safe=False)

def get_patents(request):
    return JsonResponse(invert_table(patents_table()), safe=False)

def get_patent_type_per_university(request):
    return JsonResponse(create_stacked_bar_chart_data(patent_type_per_university()), safe=False)

def get_patents_per_type(request):
    return JsonResponse(convert_to_json(patents_per_type()), safe=False)

def get_patents_per_status(request):
    return JsonResponse(convert_to_json(patents_per_status()), safe=False)

def get_patents_forecast(request):
    return JsonResponse(convert_to_json(patents_forecast()), safe=False)

@csrf_exempt
def get_abstract_classification(request):
    abstract = json.loads(request.body).get('abstract')
    classification = abstract_classification(abstract)

    return JsonResponse(json.loads(classification), safe=False)

def get_abstract_research_by_sdg(request):
    return JsonResponse(create_stacked_bar_chart_data(get_research_by_sdg()), safe=False)

def get_abstract_research_by_region(request):
    return JsonResponse(create_stacked_bar_chart_data(get_research_by_region()), safe=False)

def get_table_abstract_analysis(request):
    return JsonResponse(invert_table(get_abstract_analysis_table()), safe=False)

def get_data_research_by_suc(request):
    return JsonResponse(create_stacked_bar_chart_data(get_research_by_suc()), safe=False)

def get_data_top_10_topics(request):
    return JsonResponse(convert_to_json(get_top_10_topics()), safe=False)

def get_abstract_research_by_agency(request):
    return JsonResponse(create_stacked_bar_chart_data(get_research_by_agency()), safe=False)

def get_abstract_research_by_budget(request):
    return JsonResponse(convert_to_json(get_research_by_budget()), safe=False)

def get_research_keywords(request):
    return JsonResponse(invert_table(get_topic_keywords_table()), safe=False)