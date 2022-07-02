from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound

from core.faculty import get_faculty_profile_table as faculty_profile
from core.faculty import get_faculty_educ_attain, get_faculty_educ_attain_break

from core.utilities import makeJsonResponse, get_columns, invert_table, \
        create_stacked_bar_chart_data, SUC_NETWORK_PATH, FACULTY_NETWORK_PATH

from . consts import QUERY_PARAM_SCHOOL_NAME

import json

######################################
#      FACULTY PROFILE               #
######################################

def get_faculty_profile(request):
    return JsonResponse(invert_table(faculty_profile()), safe=False)
    
# charts

def get_faculty_education(request):
    return JsonResponse(create_stacked_bar_chart_data(get_faculty_educ_attain()), safe=False)

def get_faculty_education_breakdown(request):
    if school_name := request.GET.get(QUERY_PARAM_SCHOOL_NAME):
        return JsonResponse(json.loads(get_faculty_educ_attain_break(school_name)), safe=False)
    
    return HttpResponse(status=404)

def get_faculty_network(request):
    faculty_network_data = {}
    with open(FACULTY_NETWORK_PATH, 'r') as faculty_network:
        faculty_network_data = json.load(faculty_network)
    
    return JsonResponse(faculty_network_data, safe=False)

######################################
#      CO-AUTHORSHIP                 #
######################################

def get_suc_network(request):
    suc_network_data = {}
    with open(SUC_NETWORK_PATH, 'r') as suc_network:
        suc_network_data = json.load(suc_network)
    
    return JsonResponse(suc_network_data, safe=False)