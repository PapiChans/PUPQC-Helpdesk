from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('login', include('django.contrib.auth.urls')),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
]