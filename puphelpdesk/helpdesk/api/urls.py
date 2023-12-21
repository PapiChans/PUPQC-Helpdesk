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

    # General Info and Services: Services
    path('student/getService', views.studGetService),

        # General Info and Services: Service Referrals
    path('student/getServiceReferral', views.studGetServiceReferral),
    path('student/getReferralInfo/<uuid:referral_Id>', views.studGetServiceReferralInfo),

    # Student Support and Counseling: Success Resources
    path('student/getSuccessResources', views.studGetSuccessResources),

    #Financial Aid and Scholarship
    path('student/getFinancialAid', views.studGetFinancialAid),
    path('student/getScholarship', views.studGetScholarships),
    path('student/getGuideInfo/<uuid:guide_Id>', views.studGetGuideInfo),

    #Careers and Employment: Job Posting
    path('student/getJobPosting', views.studGetJobPosting),
    path('student/getJobPostingInfo/<uuid:job_Posting_Id>', views.studGetJobInfo),


    # Feedback and Suggestions
    path('student/submitFeedback', views.studSubmitFeedback),
    path('student/getFeedback', views.studGetFeedback),
    path('student/getFeedbackInfo/<uuid:feedback_Id>', views.studGetFeedbackInfo),
    path('student/deleteFeedback/<uuid:feedback_Id>', views.studDeleteFeedback),

    #----------------------
    # ADMIN API URLS
    #----------------------

    # Dashboard
    path('admin/FeedbackVsSuggestions', views.adminFeedbackVsSuggestions),
    path('admin/feedbackChart', views.adminFeedbackChart),
    path('admin/suggestionChart', views.adminSuggestionChart),
    path('admin/financialaidChart', views.adminFinancialAidChart),
    path('admin/careerChart', views.adminCareerChart),

    # General Info and Services: Resources
    path('admin/addCampusResources', views.adminAddCampusResources),
    path('admin/getCampusResources', views.adminGetCampusResources),
    path('admin/deleteCampusResources/<uuid:resources_Id>', views.adminDeleteCampusResources),

    # General Info and Services: Services
    path('admin/addService', views.adminAddService),
    path('admin/getService', views.adminGetService),
    path('admin/getServiceInfo/<uuid:service_Id>', views.adminGetServiceInfo),
    path('admin/editService/<uuid:service_Id>', views.adminEditService),
    path('admin/deleteService/<uuid:service_Id>', views.adminDeleteService),

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

    # General Info and Services: Service Referrals
    path('admin/addServiceReferral', views.adminAddServiceReferral),
    path('admin/getServiceReferral', views.adminGetServiceReferral),
    path('admin/getReferralInfo/<uuid:referral_Id>', views.adminGetServiceReferralInfo),
    path('admin/editServiceReferral/<uuid:referral_Id>', views.adminEditServiceReferral),
    path('admin/deleteServiceReferral/<uuid:referral_Id>', views.adminDeleteServiceReferral),

    # Student Support and Counseling: Success Resources
    path('admin/addSuccessResources', views.adminAddSuccessResources),
    path('admin/getSuccessResources', views.adminGetSuccessResources),
    path('admin/deleteSuccessResources/<uuid:success_resources_Id>', views.adminDeleteSuccessResources),

    #Financial Aid and Scholarship
    path('admin/addFinancialGuide', views.adminAddGuidePost),
    path('admin/getFinancialAid', views.adminGetFinancialAid),
    path('admin/getScholarship', views.adminGetScholarships),
    path('admin/getGuideInfo/<uuid:guide_Id>', views.adminGetGuideInfo),
    path('admin/editGuide/<uuid:guide_Id>', views.adminEditGuidePost),
    path('admin/deleteGuide/<uuid:guide_Id>', views.adminDeleteGuidePost),

    #Careers and Employment: Job Posting
    path('admin/addJobPosting', views.adminAddJobPosting),
    path('admin/getJobPosting', views.adminGetJobPosting),
    path('admin/getJobPostingInfo/<uuid:job_Posting_Id>', views.adminGetJobInfo),
    path('admin/editJobPosting/<uuid:job_Posting_Id>', views.adminEditJobPosting),
    path('admin/replaceCompanyLogo/<uuid:job_Posting_Id>', views.adminReplaceCompanyLogo),
    path('admin/deleteJobPosting/<uuid:job_Posting_Id>', views.adminDeleteJobPosting),

    # Feedback and Suggestions: Feedback
    path('admin/getNewFeedback', views.adminGetNewFeedback),
    path('admin/getReadFeedback', views.adminGetReadFeedback),
    path('admin/getFeedbackInfo/<uuid:feedback_Id>', views.adminGetFeedbackInfo),
    path('admin/feedbackMarkAsRead/<uuid:feedback_Id>', views.adminFeedbackMarkAsRead),
    path('admin/deleteFeedback/<uuid:feedback_Id>', views.adminDeleteFeedback),

    # Feedback and Suggestions: Suggestions
    path('admin/getNewSuggestion', views.adminGetNewSuggestion),
    path('admin/getReadSuggestion', views.adminGetReadSuggestion),
    path('admin/getSuggestionInfo/<uuid:feedback_Id>', views.adminGetSuggestionInfo),
    path('admin/suggestionMarkAsRead/<uuid:feedback_Id>', views.adminSuggestionMarkAsRead),
    path('admin/deleteSuggestion/<uuid:feedback_Id>', views.adminDeleteSuggestion),
]