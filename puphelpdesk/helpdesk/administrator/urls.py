from django.urls import path, include
from . import views


urlpatterns = [    
    # Admin Dashboard
    path('dashboard', views.admindashboard, name='dashboard'),
    path('profile', views.adminprofile, name='adminprofile'),
    path('editprofile', views.admineditprofile, name='admineditprofile'),
    
    #Admin General Info
    path('adminGeneralInfo/facilities', views.admingeninfofacilities, name='adminGeneralInfo/facilities'),
    path('adminGeneralInfo/services', views.admingeninfoservices, name='adminGeneralInfo/services'),
    path('adminGeneralInfo/resources', views.admingeninforesources, name='adminGeneralInfo/resources'),
    path('adminGeneralInfo/events', views.admingeninfoevents, name='adminGeneralInfo/events'),
    path('adminGeneralInfo/referrals', views.admingeninforeferrals, name='adminGeneralInfo/referrals'),
    
    #Student Services
    path('adminServices/studentSuccess', views.adminSuccessResources, name='adminServices/studentSuccess'),
    
    #Feedbacks and Suggestions
    path('adminfeedbacks/feedbacks', views.adminfeedbacks, name='adminfeedbacks/feedbacks'),
    path('adminfeedbacks/suggestions', views.adminsuggestions, name='adminfeedbacks/suggestions'),
]
