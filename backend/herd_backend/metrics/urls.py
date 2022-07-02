from django.urls import path

from . import views

urlpatterns = [
    path('research-cost/', views.get_research_cost, name="research_cost"),
    path('research-cost/funding/', views.get_research_funding, name='research_funding'),
    path('research-cost/funding-type/', views.get_research_funding_type, name='research_funding_type'),
    path('research-cost/funding-source/', views.get_research_funding_source, name="research_funding_source"),
    path('research-cost/funding-forecast/', views.get_research_funding_forecast, name="research_funding_forecast"),
    path('research-cost/univ/', views.get_research_cost_univ_scatter, name="research_cost_univ"),
    path('research-cost/region/', views.get_research_cost_rgn_scatter, name="research_cost_region"),
    path('utilization/', views.get_utilization_table, name='utilization_table'),
    path('utilization/product-per-univ/', views.get_utilization_product_per_univ, name="utilization_product_per_univ"),
    path('utilization/topics/', views.get_utilization_topics, name="utilization_topics"),
    path('utilization/beneficiaries/', views.get_beneficiaries_per_university, name="utilization_beneficiaries"),
    path('utilization/forecast/', views.get_utilization_forecast, name="utilization_forecast"),
    path('regional-development/', views.get_regional_development_table, name="regional_development"),
    path('regional-development/sdg-topics', views.get_regional_development_sdg_topics_table, name="regional_development_sdg_topics"),
]