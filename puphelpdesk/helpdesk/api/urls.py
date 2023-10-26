from django.urls import include, path
from . import views

urlpatterns = [
    path('testlogin', views.createUser),
    path('test', views.getUser),
    path('userlogin', views.userlogin)
]