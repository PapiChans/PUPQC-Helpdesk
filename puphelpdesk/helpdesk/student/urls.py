from django.urls import path, include
from . import views


urlpatterns = [
    # Student Dashboard
    path('dashboard', views.dashboard, name='dashboard'),
    path('profile', views.profile, name='profile'),

    # General Information and Services
    path('geninfo/facilities', views.geninfofacilities, name='geninfo/facilities'),
    path('geninfo/services', views.geninfoservices, name='geninfo/services'),
    path('geninfo/resources', views.geninforesources, name='geninfo/resources'),
    path('geninfo/events', views.geninfoevents, name='geninfo/events'),
    path('geninfo/referrals', views.geninforeferrals, name='geninfo/referrals'),

    # Student Support and Counseling
    path('student-support/counseling', views.studsupportcounseling, name='student-support/counseling'),
    # (Inactive) path('student-support/advising', views.studsupportadvising, name='student-support/advising'),
    # (Inactive) path('student-support/resources', views.studsupportresources, name='student-support/resources'),

    # Financial Aid and Scholarships
    path('financial-aid-and-scholarships', views.financialaid, name='financialaid'),
    path('financial-aid-and-scholarships/details', views.studFinancialAidDetails, name='financialaid/details'),

    # Housing and Accommodation
    # (Inactive) path('housing', views.housing, name='housing'),
    # (Inactive) path('housing/assistance', views.housingassistance, name="housing/assistance"),
    # (Inactive) path('housing/referrals', views.housingreferrals, name="housing/referrals"),

    # Health and Wellness Support
    path('healthwellness', views.healthwellness, name='healthwellness'),
    # (Inactive) path('healthwellness/programs', views.healthwellnessprograms, name='healthwellness/programs'),
    # (Inactive) path('healthwellness/insurance', views.healthwellnessinsurance, name='healthwellness/insurance'),

    # Career Services and Employment
    path('careers', views.careers, name='careers'),
    path('careers/counseling', views.counseling, name='careers/counseling'),
    path('careers/jobsearch', views.jobsearch, name='careers/jobsearch'),
    path('careers/internship', views.internship, name='careers/internship'),

    # Student IDs and Access Cards
    path('IDandCard', views.idandcard, name='IDandCard'),
    # (Inactive) path('IDandCard/obtaining_ID', views.IdObtaining, name='IDandCard/obtaining_ID'),
    # (Inactive) path('IDandCard/replacing_ID', views.IdReplacing, name='IDandCard/replacing_ID'),
    # (Inactive) path('IDandCard/access_cards', views.AccessCard, name='IDandCard/access_cards'),

    # Student Government and Involvement
    # (Inactive) path('StudentGovernment', views.government, name='government'),

    # Transportation and Parking
    # (Inactive) path('transportation', views.transportation, name="transportation"),
    # (Inactive) path('transportation/routes', views.transportationroutes, name="transportation/routes"),
    # (Inactive) path('transportation/permit', views.transportationpermit, name="transportation/permit"),
    # (Inactive) path('transportation/regulation', views.transportationregulation, name="transportation/regulation"),

    # Lost annd Found Services
    path('LostAndFound', views.lostAndFound, name='LostAndFound'),
    path('LostAndFound/items', views.ItemLost, name="LostAndFound/items"),
    path('LostAndFound/items/AddItem', views.AddItemLost, name="LostAndFound/items/AddItem"),
    path('LostAndFound/retrieval', views.ItemRetrieval, name="LostAndFound/retrieval"),

    # Student Feedback and Suggestions
    path('feedback', views.feedback, name='feedback'),

    # Frequently Asked Questions
    path('frequently-asked-questions', views.faqs, name='frequently-asked-questions'),

    # FIS
    path('FIS', views.fis, name='FIS'),

    # Ticket
    path('ticket', views.ticket, name='ticket'),
    path('ticket/How-to-Use', views.howtouseticket, name='ticket/howtouse'),
    path('ticket/view', views.viewticket, name='ticket/view'),

    # Charters
    path('charters', views.studcharters, name='charters'),
    path('charters/details', views.studchartersdetails, name='charters/details'),
]