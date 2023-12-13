from django.urls import path, include
from . import views


urlpatterns = [    
    # Admin Dashboard
    path('dashboard', views.admindashboard, name='admin/dashboard'),
    path('profile', views.adminprofile, name='admin/profile'),
    path('editprofile', views.admineditprofile, name='admin/editprofile'),
    
    
    #Student Account Requests
    path('students', views.adminStudents, name='students'),
    
    
    # General Information and Services
    path('geninfo/facilities', views.admingeninfofacilities, name='admin/geninfo/facilities'),
    path('geninfo/services', views.admingeninfoservices, name='admin/geninfo/services'),
    path('geninfo/resources', views.admingeninforesources, name='admin/geninfo/resources'),
    path('geninfo/events', views.admingeninfoevents, name='admin/geninfo/events'),
    path('geninfo/referrals', views.admingeninforeferrals, name='admin/geninfo/referrals'),
    
    # Student Support and Counseling
    path('student-support/resources', views.adminSuccessResources, name='admin/student-support/resources'),
    
    #Feedbacks and Suggestions
    path('feedback', views.adminfeedbacks, name='admin/feedbacks'),
    path('suggestions', views.adminsuggestions, name='admin/suggestions'),
    
    #ID and Access Cards
    path('student-services/IDRequests', views.adminIdCard, name='admin/student-services/IDRequests'),
    
    #Careers and Employment
    path('careers', views.adminCareers, name='admin/student-careers/Employment'),
    path('careers/internship', views.adminInternship, name='admin/student-careers/Referrals'),
    path('careers/referrals', views.adminReferrals, name='admin/student-careers/Counseling'),
    path('careers/internship/addposting', views.adminAddJobPosting, name='admin/student-careers/Referrals/AddPosting'),
    
    #Financial Aid Guide
    path('financial-aid-and-scholarships', views.adminFinancialAid, name='admin/student-services/FinancialAid'),
    path('financial-aid-and-scholarships/AddPost', views.adminFinancialGuidePosting, name='admin/student-services/FinancialAid/AddPost'),
]
