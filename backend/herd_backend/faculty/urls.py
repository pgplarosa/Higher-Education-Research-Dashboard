from django.urls import path

from . import views

urlpatterns = [
    path('profiles/', views.get_faculty_profile, name="faculty_profile"),
    path('profiles/education', views.get_faculty_education, name="faculty_education"),
    path('profiles/education-breakdown', views.get_faculty_education_breakdown, name="faculty_education_breakdown"),
    path('profiles/network', views.get_faculty_network, name="faculty_network"),
    path('coauthorship/suc-network', views.get_suc_network, name="coauthorship_suc_network"),
]