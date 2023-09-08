from django.urls import path
from . import views 


urlpatterns = [

    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('admin', views.admin, name='admin'),
    path('login', views.login, name='login'),

    # Services
    path('services_view', views.services_view, name='services_view'),
    
    # Student Dashboard
    path('dashboard', views.dashboard, name='dashboard'),
    path('tickets', views.tickets, name='tickets'),

    # General Information and Services
    path('geninfo/facilities', views.geninfofacilities, name='geninfo/facilities'),
    path('geninfo/services', views.geninfoservices, name='geninfo/services'),
    path('geninfo/resources', views.geninforesources, name='geninfo/resources'),
    path('geninfo/events', views.geninfoevents, name='geninfo/events'),
    path('geninfo/referrals', views.geninforeferrals, name='geninfo/referrals'),

    # Student Support and Counseling
    path('student-support/counseling', views.studsupportcounseling, name='student-support/counseling'),
    path('student-support/advising', views.studsupportadvising, name='student-support/advising'),
    path('student-support/resources', views.studsupportresources, name='student-support/resources'),

    # Financial Aid and Scholarships
    path('financialaid', views.financialaid, name='financialaid'),
    path('scholarship_form', views.scholarship_form, name='scholarship_form'),

    # Housing and Accommodation
    path('housing', views.housing, name='housing'),

    # Health and Wellness Support
    path('healthwellness', views.healthwellness, name='healthwellness'),

    # Career Services and Employment
    path('careers', views.careers, name='careers'),

    # Student IDs and Access Cards
    path('idandcard', views.idandcard, name='idandcard'),

    # Student Government and Involvement
    path('government', views.government, name='government'),

    # Transportation and Parking
    path('parking', views.parking, name='parking'),

    # Lost annd Found Services
    path('lostandfound', views.lostandfound, name='lostandfound'),
    path('lostandfoundview', views.lost_and_found_views, name='lost_and_found_views'),
    path('return_item', views.return_item, name='return_item'),

    # Student Feedback and Suggestions
    path('feedback', views.feedback, name='feedback'),

]