from django.urls import path, include
from . import views


urlpatterns = [
    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('login', views.login, name='login'),

    #---------------------------------------------
    # Student
    #---------------------------------------------

    # Services
    path('services_view', views.services_view, name='services_view'),
    
    # Student Dashboard
    path('dashboard', views.dashboard, name='dashboard'),
    path('dashboard2', views.dashboard2, name='dashboard2'),
    path('tickets', views.tickets, name='tickets'),
    path('profile', views.profile, name='profile'),
    path('editprofile', views.editprofile, name='editprofile'),

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
    path('financialguidance', views.financialguidance, name='financialguidance'),
    path('scholarshipForm', views.scholarshipForm, name='scholarshipForm'),

    # Housing and Accommodation
    path('housing', views.housing, name='housing'),

    # Health and Wellness Support
    path('healthwellness', views.healthwellness, name='healthwellness'),
    path('healthServices', views.healthServices, name='healthServices'),

    # Career Services and Employment
    path('careers', views.careers, name='careers'),
    path('referrals', views.referrals, name='referrals'),
    path('internship', views.internship, name='internship'),

    # Student IDs and Access Cards
    path('idandcard', views.idandcard, name='idandcard'),
    path('newIdRequest', views.newIdRequest, name='newIdRequest'),
    path('IDvalidation', views.IDvalidation, name='IDvalidation'),

    # Student Government and Involvement
    path('government', views.government, name='government'),

    # Transportation and Parking
    path('parking', views.parking, name='parking'),
    path('parkingSlot', views.parkingSlot, name='parkingSlot'),
    path('transportInfo', views.transportInfo, name='transportInfo'),

    # Lost annd Found Services
    path('lostandfound', views.lostandfound, name='lostandfound'),
    path('lostandfoundview', views.lost_and_found_views, name='lost_and_found_views'),
    path('returnItems', views.returnItems, name='returnItems'),

    # Student Feedback and Suggestions
    path('feedback', views.feedback, name='feedback'),

    #---------------------------------------------
    # Admin
    #---------------------------------------------

    # Dashboard
    path('admin/dashboard', views.admindashboard, name='admin/dashboard'),
    path('admin/profile', views.adminprofile, name='admin/profile'),
    path('admin/editprofile', views.admineditprofile, name='admin/editprofile'),

]