from django.urls import path

from . import views

urlpatterns = [
    path('research-relevance/', views.get_research_relevance_table, name="research_relevance_table"),
    path('scope/', views.get_research_relevance_scope, name="research_relevance"),
    path('citations/', views.get_citations, name="research_relevance"),
    path('abstract/', views.get_table_abstract_analysis, name="abstract_analysis"),
    path('patents/', views.get_patents, name="patents_table"),
    path('patents/type-per-univ', views.get_patent_type_per_university, name='patent_type_per_university'),
    path('patents/per-type', views.get_patents_per_type, name="patents_per_type"),
    path('patents/per-status', views.get_patents_per_status, name="patents_per_status"),
    path('patents/forecast', views.get_patents_forecast, name="patents_forecast"),
    path('abstract/classification', views.get_abstract_classification, name="abstract_classification"),
    path('abstract/research-by-suc', views.get_data_research_by_suc, name="research_by_suc"),
    path('abstract/research-top-topics', views.get_data_top_10_topics, name="research_top_topics"),
    path('abstract/research-by-sdg', views.get_abstract_research_by_sdg, name="research_by_sdg"),
    path('abstract/research-by-region', views.get_abstract_research_by_region, name="research_by_region"),
    path('abstract/research-by-agency', views.get_abstract_research_by_agency, name="research_by_agency"),
    path('abstract/research-by-budget', views.get_abstract_research_by_budget, name="research_by_budget"),
    path('abstract/keywords', views.get_research_keywords, name="research_keywords")
]