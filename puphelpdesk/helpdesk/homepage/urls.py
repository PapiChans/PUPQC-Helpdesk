from django.urls import path, include
from . import views


urlpatterns = [
    # Homepage
    path('', views.index, name='index'),

    # Authentication
    path('login', views.login, name='login'),

    # HTTP Response Page
    path('error/401', views.error401page, name='error/401'),
    path('error/404', views.error404page, name='error/404'),


]