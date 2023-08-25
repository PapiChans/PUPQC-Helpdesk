from django.urls import path
from . import views 


urlpatterns = [
    path('', views.index, name='index'),
    path('services/', views.services_view, name='services_view'),
    path('lostandfound', views.lost_and_found_views, name='lost_and_found_views'),
    path('admin', views.admin, name='admin'),
    path('return_item', views.return_item, name='return_item'),
     path('log_in', views.log_in, name='log_in'),
]