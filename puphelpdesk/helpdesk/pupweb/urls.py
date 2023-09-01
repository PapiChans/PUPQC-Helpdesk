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

    # General Information and Services

    # Student Support and Counseling
    
    # Financial Aid and Scholarships
    path('scholarship_form', views.scholarship_form, name='scholarship_form'),

    # Housing and Accommodation

    # Health and Wellness Support

    # Career Services and Employment

    # Student IDs and Access Cards

    # Student Government and Involvement

    # Transportation and Parking

    # Lost annd Found Services
    path('lostandfound', views.lost_and_found_views, name='lost_and_found_views'),
    path('return_item', views.return_item, name='return_item'),

    # Student Feedback and Suggestions

]