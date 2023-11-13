from django.urls import include, path
from . import views

urlpatterns = [
    #----------------------
    # STUDENT API URLS
    #----------------------

    # Dashboard
    path('student/dashboard-event', views.studfetchEvent),

    # General Info and Services: Event
    path('student/getEvent', views.studGetEvent),
    path('student/getEventInfo/<uuid:event_Id>', views.studGetEventInfo),

    # General Info and Services: Facilities
    path('student/getFacility', views.studGetFacility),

    # General Info and Services: Resources
    path('student/getCampusResources', views.studGetCampusResources),

    # Student Support and Counseling: Success Resources
    path('student/getSuccessResources', views.studGetSuccessResources),

    #----------------------
    # ADMIN API URLS
    #----------------------

    # General Info and Services: Resources
    path('admin/addCampusResources', views.adminAddCampusResources),
    path('admin/getCampusResources', views.adminGetCampusResources),
    path('admin/deleteCampusResources/<uuid:resources_Id>', views.adminDeleteCampusResources),

    # General Info and Services: Event
    path('admin/addEvent', views.adminAddEvent),
    path('admin/getEvent', views.adminGetEvent),
    path('admin/getEventInfo/<uuid:event_Id>', views.adminGetEventInfo),
    path('admin/deleteEvent/<uuid:event_Id>', views.adminDeleteEvent),
    path('admin/editEvent/<uuid:event_Id>', views.adminEditEvent),
    path('admin/uploadEventImage/<uuid:event_Id>', views.adminUploadEventImage),
    path('admin/deleteEventImage/<uuid:event_Id>', views.adminDeleteEventImage),

    # General Info and Services: Facilities
    path('admin/addFacility', views.adminAddFacility),
    path('admin/getFacility', views.adminGetFacility),
    path('admin/getFacilityInfo/<uuid:facility_Id>', views.adminGetFacilityInfo),
    path('admin/deleteFacility/<uuid:facility_Id>', views.adminDeleteFacility),
    path('admin/editFacility/<uuid:facility_Id>', views.adminEditFacility),
    path('admin/replaceFacilityImage/<uuid:facility_Id>', views.adminReplaceFacilityImage),

    # Student Support and Counseling: Success Resources
    path('admin/addSuccessResources', views.adminAddSuccessResources),
    path('admin/getSuccessResources', views.adminGetSuccessResources),
    path('admin/deleteSuccessResources/<uuid:success_resources_Id>', views.adminDeleteSuccessResources),
]