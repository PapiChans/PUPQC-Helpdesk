from django.urls import path, include
from . import views


urlpatterns = [
    # Student Dashboard
    path('dashboard', views.dashboard, name='dashboard'),
    path('tickets', views.tickets, name='tickets'),
    path('profile', views.profile, name='profile'),
    path('editprofile', views.editprofile, name='editprofile'),

    # General Information and Services
    path('geninfo/facilities', views.geninfofacilities, name='geninfo/facilities'),
    path('geninfo/services', views.geninfoservices, name='geninfo/services'),
    path('geninfo/resources', views.geninforesources, name='geninfo/resources'),
    path('geninfo/events', views.geninfoevents, name='geninfo/events'),
    path('geninfo/referrals', views.geninforeferrals, name='geninfo/referrals'),

    # Student Support and Counseling
    path('student-support/counseling', views.studsupportcounseling, name='student-support/counseling'),
    path('student-support/advising', views.studsupportadvising, name='student-support/advising'),
    path('student-support/resources', views.studsupportresources, name='student-support/resources'),

    # Financial Aid and Scholarships
    path('financial-aid-and-scholarships', views.financialaid, name='financialaid'),

    # Housing and Accommodation
    path('housing', views.housing, name='housing'),

    # Health and Wellness Support
    path('healthwellness', views.healthwellness, name='healthwellness'),
    path('healthServices', views.healthServices, name='healthServices'),

    # Career Services and Employment
    path('careers', views.careers, name='careers'),
    path('careers/referrals', views.referrals, name='careers/referrals'),
    path('careers/internship', views.internship, name='careers/internship'),

    # Student IDs and Access Cards
    path('IDandCard', views.idandcard, name='IDandCard'),
    path('IDandCard/newIDRequest', views.newIdRequest, name='IDandCard/newIDRequest'),
    path('IDandCard/validation', views.IDvalidation, name='IDandCard/validation'),

    # Student Government and Involvement
    path('government', views.government, name='government'),

    # Transportation and Parking
    path('parking', views.parking, name='parking'),
    path('parking/slot', views.parkingSlot, name='parking/slot'),
    path('parking/transportInfo', views.transportInfo, name='parking/transportInfo'),

    # Lost annd Found Services
    path('LostandFound', views.lostandfound, name='LostandFound'),
    path('LostandFound/returnItems', views.returnItems, name='LostandFound/returnItems'),
    path('LostandFound/itemsList', views.item_list, name='LostandFound/itemsList'),

    # Student Feedback and Suggestions
    path('feedback', views.feedback, name='feedback'),
]