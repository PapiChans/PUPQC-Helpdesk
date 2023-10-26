from django.urls import path, include
from . import views


urlpatterns = [    
    # Admin Dashboard
    path('dashboard', views.admindashboard, name='admindashboard'),
    path('profile', views.adminprofile, name='adminprofile'),
    path('editprofile', views.admineditprofile, name='admineditprofile'),
    
    #Admin General Info
    path('generalinfo/facilities', views.admingeninfofacilities, name='generalinfo/facilities'),
    path('generalinfo/services', views.admingeninfoservices, name='generalinfo/services'),
    path('generalinfo/resources', views.admingeninforesources, name='generalinfo/resources'),
    path('generalinfo/events', views.admingeninfoevents, name='generalinfo/events'),
    path('generalinfo/referrals', views.admingeninforeferrals, name='generalinfo/referrals'),
]
