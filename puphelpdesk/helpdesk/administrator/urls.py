from django.urls import path, include
from . import views


urlpatterns = [    
    # Admin Dashboard
    path('dashboard', views.admindashboard, name='admin/dashboard'),
    path('profile', views.adminprofile, name='admin/profile'),

    # User Management
    path('user-management', views.adminusermanagement, name='admin/user-management'),
    
    # General Information and Services
    path('geninfo/facilities', views.admingeninfofacilities, name='admin/geninfo/facilities'),
    path('geninfo/services', views.admingeninfoservices, name='admin/geninfo/services'),
    path('geninfo/resources', views.admingeninforesources, name='admin/geninfo/resources'),
    path('geninfo/events', views.admingeninfoevents, name='admin/geninfo/events'),
    path('geninfo/referrals', views.admingeninforeferrals, name='admin/geninfo/referrals'),
    
    # Student Support and Counseling
    path('student-support/counseling', views.adminSupportCounseling, name='admin/student-support/counseling'),
    # (Inactive)path('student-support/advising', views.adminAcademicAdvising, name='admin/student-support/advising'),
    # (Inactive)path('student-support/resources', views.adminSuccessResources, name='admin/student-support/resources'),
    
    #Feedbacks and Suggestions
    path('feedback', views.adminfeedbacks, name='admin/feedbacks'),
    path('suggestions', views.adminsuggestions, name='admin/suggestions'),
    
    #ID and Access Cards
    path('IDandCard', views.adminIdCard, name='admin/student-services/IDRequests'),
    # (Inactive)path('IDandCard/obtaining_ID', views.adminIdObtaining, name='admin/IDandCard/obtaining_ID'),
    # (Inactive)path('IDandCard/replacing_ID', views.adminIdReplacing, name='admin/IDandCard/replacing_ID'),
    # (Inactive)path('IDandCard/access_cards', views.adminAccessCard, name='admin/IDandCard/access_cards'),
    
    #Careers and Employment
    path('careers', views.adminCareers, name='admin/student-careers/Employment'),
    path('careers/internship', views.adminInternship, name='admin/student-careers/Referrals'),
    path('careers/counseling', views.adminCounseling, name='admin/student-careers/Counseling'),
    path('careers/jobsearch', views.adminJobSearch, name='admin/student-careers/JobSearch'),
    path('careers/internship/addposting', views.adminAddJobPosting, name='admin/student-careers/Referrals/AddPosting'),
    
    #Financial Aid Guide
    path('financial-aid-and-scholarships', views.adminFinancialAid, name='admin/student-services/FinancialAid'),
    path('financial-aid-and-scholarships/AddPost', views.adminFinancialGuidePosting, name='admin/student-services/FinancialAid/AddPost'),
    path('financial-aid-and-scholarships/details', views.adminFinancialAidDetails, name='admin/student-services/FinancialAid/details'),

    # Student Government and Involvement
    # (Inactive)path('StudentGovernment', views.adminGovernment, name='admin/studentgovernment'),

    # Health and Wellness Support
    path('healthwellness', views.adminhealthwellness, name="admin/healthwellness"),
    # (Inactive) path('healthwellness/programs', views.adminhealthwellnessprograms, name="admin/healthwellness/programs"),
    # (Inactive) path('healthwellness/insurance', views.adminhealthwellnessinsurance, name="admin/healthwellness/insurance"),

    # Housing and Accomodation
    # (Inactive)path('housing', views.adminhousing, name="admin/housing"),
    # (Inactive)path('housing/assistance', views.adminhousingassistance, name="admin/housing/assistance"),
    # (Inactive)path('housing/referrals', views.adminhousingreferrals, name="admin/housing/referrals"),

    # Transportation and Parking
    # (Inactive)path('transportation', views.admintransportation, name="admin/transportation"),
    # (Inactive)path('transportation/routes', views.admintransportationroutes, name="admin/transportation/routes"),
    # (Inactive)path('transportation/permit', views.admintransportationpermit, name="admin/transportation/permit"),
    # (Inactive)path('transportation/regulation', views.admintransportationregulation, name="admin/transportation/regulation"),

    # Lost and Found
    path('LostAndFound', views.adminlostandfound, name="admin/LostAndFound"),
    path('LostAndFound/items', views.adminItemLost, name="admin/LostAndFound/items"),
    path('LostAndFound/retrieval', views.adminItemRetrieval, name="admin/LostAndFound/retrieval"),

    #Frequently Asked Questions
    path('frequently-asked-questions', views.adminFaqs, name='admin/frequently-asked-questions'),

    #Ticket
    path('ticket', views.adminticket, name='admin/ticket'),
    path('ticket/view', views.adminviewticket, name='admin/ticket/view'),

    # Charters
    path('charters', views.admincharters, name='admin/charters'),
    path('charters/details', views.adminchartersdetails, name='admin/charters/details'),

    # Faculty Information System
    path('FIS', views.adminFIS, name='admin/FIS'),

    # Knowledgebase
    path('knowledgebase', views.adminKnowledgebase, name='admin/knowledgebase'),
    path('knowledgebase/create', views.adminCreateKnowledgebase, name='admin/knowledgebase/create'),
]
