from django.urls import path, include
from . import views


urlpatterns = [
    # Student Dashboard
    path('dashboard', views.dashboard, name='dashboard'),
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
    path('housing/assistance', views.housingassistance, name="housing/assistance"),
    path('housing/referrals', views.housingreferrals, name="housing/referrals"),

    # Health and Wellness Support
    path('healthwellness', views.healthwellness, name='healthwellness'),
    path('healthwellness/programs', views.healthwellnessprograms, name='healthwellness/programs'),
    path('healthwellness/insurance', views.healthwellnessinsurance, name='healthwellness/insurance'),

    # Career Services and Employment
    path('careers', views.careers, name='careers'),
    path('careers/counseling', views.counseling, name='careers/counseling'),
    path('careers/jobsearch', views.jobsearch, name='careers/jobsearch'),
    path('careers/internship', views.internship, name='careers/internship'),

    # Student IDs and Access Cards
    path('IDandCard', views.idandcard, name='IDandCard'),
    path('IDandCard/obtaining_ID', views.IdObtaining, name='IDandCard/obtaining_ID'),
    path('IDandCard/replacing_ID', views.IdReplacing, name='IDandCard/replacing_ID'),
    path('IDandCard/access_cards', views.AccessCard, name='IDandCard/access_cards'),

    # Student Government and Involvement
    path('StudentGovernment', views.government, name='government'),

    # Transportation and Parking
    path('transportation', views.transportation, name="transportation"),
    path('transportation/routes', views.transportationroutes, name="transportation/routes"),
    path('transportation/permit', views.transportationpermit, name="transportation/permit"),
    path('transportation/regulation', views.transportationregulation, name="transportation/regulation"),

    # Lost annd Found Services
    path('LostAndFound', views.lostAndFound, name='LostAndFound'),
    path('LostAndFound/items', views.ItemLost, name="LostAndFound/items"),
    path('LostAndFound/items/AddItem', views.AddItemLost, name="LostAndFound/items/AddItem"),
    path('LostAndFound/retrieval', views.ItemRetrieval, name="LostAndFound/retrieval"),

    # Student Feedback and Suggestions
    path('feedback', views.feedback, name='feedback'),

    # Frequently Asked Questions
    path('frequently-asked-questions', views.faqs, name='frequently-asked-questions'),
]