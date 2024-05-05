from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('login/', include('django.contrib.auth.urls')),
    path('login/', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('Unauthorized', views.error_401, name='error/401'),
    path('Not_Found', views.error_404, name='error/404'),
]