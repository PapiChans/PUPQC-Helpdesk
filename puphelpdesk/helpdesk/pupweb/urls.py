from django.urls import path
from . import views 


urlpatterns = [

    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('admin', views.admin, name='admin'),
    path('log_in', views.log_in, name='log_in'),

    # Services
    path('services_view', views.services_view, name='services_view'),

    # Lost annd Found
    path('lostandfound', views.lost_and_found_views, name='lost_and_found_views'),
    path('return_item', views.return_item, name='return_item'),
    
    # Scholarship
    path('scholarship_form', views.scholarship_form, name='scholarship_form'),

]