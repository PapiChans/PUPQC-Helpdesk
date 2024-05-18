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
    path('ticketing', views.ticketing, name='ticketing'),
    path('ticketStatus', views.ticketStatus, name='ticketStatus'),
    path('Unauthorized', views.error_401, name='error/401'),
    path('Not_Found', views.error_404, name='error/404'),

    # Knowledgebase
    path('knowledgebase', views.mainknowledgebase, name="main/knowledgebase"),
    path('knowledgebase/browse', views.mainknowledgebasebrowse, name="main/knowledgebase/browse"),
    path('knowledgebase/view', views.mainknowledgebaseview, name="main/knowledgebase/view"),
]