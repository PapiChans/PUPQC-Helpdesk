from django.urls import path, include
from . import views


urlpatterns = [    
    # Admin Dashboard
    path('dashboard', views.admindashboard, name='admindashboard'),
    path('profile', views.adminprofile, name='adminprofile'),
    path('editprofile', views.admineditprofile, name='admineditprofile'),

]