from django.urls import include, path
from . import views

urlpatterns = [
    #----------------------
    # STUDENT API URLS
    #----------------------

    #----------------------
    # ADMIN API URLS
    #----------------------

    # General Info and Services: Event
    path('admin/addEvent', views.addEvent),
    path('admin/getEvent', views.getEvent),
    path('admin/getEventInfo/<uuid:event_Id>', views.getEventInfo),
]