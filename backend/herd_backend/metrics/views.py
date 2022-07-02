from django.shortcuts import render

from core.research_cost import get_research_cost_table as research_cost_table
from core.research_cost import get_research_cost_budget
from core.research_cost import get_research_cost_funding_type as funding_type
from core.research_cost import get_research_cost_funding_source as funding_source
from core.research_cost import get_research_cost_budget_line as funding_forecast
from core.research_cost import get_research_cost_university_scatter, get_research_cost_region_scatter

from core.utilization import get_utilization_table as utilization_table
from core.utilization import get_utilization_product_univ as util_product_per_univ
from core.utilization import get_utilization_topics as util_topics
from core.utilization import get_utilization_beneficiaries as util_beneficiaries
from core.utilization import get_utilization_yearly as utilization_forecast

from core.regional_development import get_regional_development_table as regional_development_table, get_sdg_topics_table

from core.utilities import makeJsonResponse, get_columns, process_for_response, invert_table, create_stacked_bar_chart_data

from django.http import JsonResponse

######################################
#           RESEARCH COST            #
######################################

def get_research_cost(request):
    return JsonResponse(invert_table(research_cost_table()), safe=False)

# chart data

def get_research_funding(request):
    return makeJsonResponse(get_research_cost_budget())

def get_research_funding_type(request):
    return JsonResponse(create_stacked_bar_chart_data(funding_type()), safe=False)

def get_research_funding_source(request):
    return makeJsonResponse(funding_source())

def get_research_funding_forecast(request):
    return makeJsonResponse(funding_forecast())

def get_research_cost_univ_scatter(request):
    return JsonResponse(invert_table(get_research_cost_university_scatter(), index_name="University", preserve_index=True), safe=False)

def get_research_cost_rgn_scatter(request):
    return JsonResponse(invert_table(get_research_cost_region_scatter(), index_name="Region", preserve_index=True), safe=False)

######################################
#             UTILIZATION            #
######################################

def get_utilization_table(request):
    return JsonResponse(invert_table(utilization_table()), safe=False)
    
#  charts

def get_utilization_product_per_univ(request):
    return JsonResponse(create_stacked_bar_chart_data(util_product_per_univ()), safe=False)

def get_utilization_topics(request):
    return makeJsonResponse(util_topics())

def get_beneficiaries_per_university(request):
    return makeJsonResponse(util_beneficiaries())

def get_utilization_forecast(request):
    return makeJsonResponse(utilization_forecast())


######################################
#      REGIONAL DEVELOPMENT          #
######################################

def get_regional_development_table(request):
    return JsonResponse(invert_table(regional_development_table()), safe=False)

def get_regional_development_sdg_topics_table(request):
    return JsonResponse(invert_table(get_sdg_topics_table()), safe=False)
