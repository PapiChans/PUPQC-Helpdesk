from django.urls import include, path
from . import views

urlpatterns = [
    #----------------------
    # STUDENT API URLS
    #----------------------

    # Dashboard
    path('student/dashboard-event', views.studfetchEvent),
    path('student/dashboard-jobpost', views.studfetchJobPosting),

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

    # Student Support and Counseling: Support Counseling
    path('student/getSupportCounselor', views.studGetSupportCounselor),
    path('student/getSupportCounselorInfo/<uuid:counselor_Id>', views.studGetSupportCounselorInfo),

    # Student Support and Counseling: Academic Advising
    path('student/getAcademicAdviser', views.studGetAcademicAdviser),
    path('student/getAcademicAdviserInfo/<uuid:adviser_Id>', views.studGetAcademicAdviserInfo),

    # Student Support and Counseling: Success Resources
    path('student/getSuccessResources', views.studGetSuccessResources),

    #Financial Aid and Scholarship
    path('student/getFinancialAid', views.studGetFinancialAid),
    path('student/getScholarship', views.studGetScholarships),
    path('student/getGuideInfo/<uuid:guide_Id>', views.studGetGuideInfo),

    # Careers and Employment: Career Counseling
    path('student/getCounseling', views.studGetCounseling),
    path('student/getCounselingInfo/<uuid:counseling_Id>', views.studGetCounselingInfo),

    # Careers and Employment: Job Search Resources
    path('student/getJobSearch', views.studGetJobSearch),

    #Careers and Employment: Job Posting
    path('student/getJobPosting', views.studGetJobPosting),
    path('student/getJobPostingInfo/<uuid:job_Posting_Id>', views.studGetJobInfo),

    # ID and Access Cards
    path('student/getObtainingStep', views.studGetObtainingStep),
    path('student/getReplacingStep', views.studGetReplacingStep),
    path('student/getAccessCardStep', views.studGetAccessCardStep),

    # Student Government and Involvement
    path('student/getGovernment', views.studGetGovernment),
    path('student/getGovernmentInfo/<uuid:government_Id>', views.studGetGovernmentInfo),

    # Health and Wellness Programs: Health Service Referrals
    path('student/getHealthFacility', views.studGetHealthFacility),
    path('student/getHealthFacilityInfo/<uuid:health_Facility_Id>', views.studGetHealthFacilityInfo),

    # Health and Wellness Programs: Health Insurance
    path('student/getHealthInsurance', views.studGetHealthInsurance),
    path('student/getHealthInsuranceInfo/<uuid:health_Insurance_Id>', views.studGetHealthInsuranceInfo),

    # Housing and Accomodation: Housing Options Referrals
    path('student/getHousingReferrals', views.studGetHousingReferrals),
    path('student/getHousingReferralsInfo/<uuid:housing_Id>', views.studGetHousingReferralsInfo),

    # Housing and Accomodation: Off-Campus Living Assistance
    path('student/getLivingAssistance', views.studGetLivingAssistance),

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
    path('admin/servicereferralChart', views.adminServiceReferralChart),
    path('admin/idandcardChart', views.adminIDandCardChart),
    path('admin/studentgovernmentChart', views.adminStudentGovernmentChart),
    path('admin/healthfacilityChart', views.adminHealthFacilityChart),

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

    # Student Support and Counseling: Support Counseling
    path('admin/addSupportCounselor', views.adminAddSupportCounselor),
    path('admin/getSupportCounselor', views.adminGetSupportCounselor),
    path('admin/getSupportCounselorInfo/<uuid:counselor_Id>', views.adminGetSupportCounselorInfo),
    path('admin/editSupportCounselor/<uuid:counselor_Id>', views.adminEditSupportCounselor),
    path('admin/deleteSupportCounselor/<uuid:counselor_Id>', views.adminDeleteSupportCounselor),

    # Student Support and Counseling: Academic Advising
    path('admin/addAcademicAdviser', views.adminAddAcademicAdviser),
    path('admin/getAcademicAdviser', views.adminGetAcademicAdviser),
    path('admin/getAcademicAdviserInfo/<uuid:adviser_Id>', views.adminGetAcademicAdviserInfo),
    path('admin/editAcademicAdviser/<uuid:adviser_Id>', views.adminEditAcademicAdviser),
    path('admin/deleteAcademicAdviser/<uuid:adviser_Id>', views.adminDeleteAcademicAdviser),

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

    # Careers and Employment: Career Counseling
    path('admin/addCounseling', views.adminAddCounseling),
    path('admin/getCounseling', views.adminGetCounseling),
    path('admin/getCounselingInfo/<uuid:counseling_Id>', views.adminGetCounselingInfo),
    path('admin/editCounseling/<uuid:counseling_Id>', views.adminEditCounseling),
    path('admin/deleteCounseling/<uuid:counseling_Id>', views.adminDeleteCounseling),

    # Careers and Employment: Job Search Resources
    path('admin/addJobSearch', views.adminAddJobSearch),
    path('admin/getJobSearch', views.adminGetJobSearch),
    path('admin/getJobSearchInfo/<uuid:job_Search_Id>', views.adminGetJobSearchInfo),
    path('admin/editJobSearch/<uuid:job_Search_Id>', views.adminEditJobSearch),
    path('admin/deleteJobSearch/<uuid:job_Search_Id>', views.adminDeleteJobSearch),

    # Careers and Employment: Job Posting
    path('admin/addJobPosting', views.adminAddJobPosting),
    path('admin/getJobPosting', views.adminGetJobPosting),
    path('admin/getJobPostingInfo/<uuid:job_Posting_Id>', views.adminGetJobInfo),
    path('admin/editJobPosting/<uuid:job_Posting_Id>', views.adminEditJobPosting),
    path('admin/replaceCompanyLogo/<uuid:job_Posting_Id>', views.adminReplaceCompanyLogo),
    path('admin/deleteJobPosting/<uuid:job_Posting_Id>', views.adminDeleteJobPosting),

    # ID and Access Cards
    path('admin/addObtainingStep', views.adminAddObtainingStep),
    path('admin/addReplacingStep', views.adminAddReplacingStep),
    path('admin/addAccessCardStep', views.adminAddAccessCardStep),
    path('admin/getObtainingStep', views.adminGetObtainingStep),
    path('admin/getReplacingStep', views.adminGetReplacingStep),
    path('admin/getAccessCardStep', views.adminGetAccessCardStep),
    path('admin/getStepInfo/<uuid:guide_Id>', views.adminGetStepInfo),
    path('admin/editGuideStep/<uuid:guide_Id>', views.adminEditGuide),
    path('admin/deleteGuideStep/<uuid:guide_Id>', views.adminDeleteGuide),

    # Student Government and Involvement
    path('admin/addGovernment', views.adminAddGovernment),
    path('admin/getGovernment', views.adminGetGovernment),
    path('admin/getGovernmentInfo/<uuid:government_Id>', views.adminGetGovernmentInfo),
    path('admin/editGovernment/<uuid:government_Id>', views.adminEditGovernment),
    path('admin/deleteGovernment/<uuid:government_Id>', views.adminDeleteGovernment),

    # Health and Wellness Programs: Health Service Referrals
    path('admin/addHealthFacility', views.adminAddHealthFacility),
    path('admin/getHealthFacility', views.adminGetHealthFacility),
    path('admin/getHealthFacilityInfo/<uuid:health_Facility_Id>', views.adminGetHealthFacilityInfo),
    path('admin/editHealthFacility/<uuid:health_Facility_Id>', views.adminEditHealthFacility),
    path('admin/deleteHealthFacility/<uuid:health_Facility_Id>', views.adminDeleteHealthFacility),

    # Health and Wellness Programs: Health Insurance
    path('admin/addHealthInsurance', views.adminAddHealthInsurance),
    path('admin/getHealthInsurance', views.adminGetHealthInsurance),
    path('admin/getHealthInsuranceInfo/<uuid:health_Insurance_Id>', views.adminGetHealthInsuranceInfo),
    path('admin/editHealthInsurance/<uuid:health_Insurance_Id>', views.adminEditHealthInsurance),
    path('admin/deleteHealthInsurance/<uuid:health_Insurance_Id>', views.adminDeleteHealthInsurance),

    # Housing and Accomodation: Housing Options Referrals
    path('admin/addHousingReferrals', views.adminAddHousingReferrals),
    path('admin/getHousingReferrals', views.adminGetHousingReferrals),
    path('admin/getHousingReferralsInfo/<uuid:housing_Id>', views.adminGetHousingReferralsInfo),
    path('admin/editHousingReferrals/<uuid:housing_Id>', views.adminEditHousingReferrals),
    path('admin/replaceHousingReferralsImage/<uuid:housing_Id>', views.adminReplaceHousingReferralsImage),
    path('admin/deleteHousingReferrals/<uuid:housing_Id>', views.adminDeleteHousingReferrals),

    # Housing and Accomodation: Off-Campus Living Assistance
    path('admin/addLivingAssistance', views.adminAddLivingAssistance),
    path('admin/getLivingAssistance', views.adminGetLivingAssistance),
    path('admin/getLivingAssistanceInfo/<uuid:assistance_Id>', views.adminGetLivingAssistanceInfo),
    path('admin/editLivingAssistance/<uuid:assistance_Id>', views.adminEditLivingAssistance),
    path('admin/deleteLivingAssistance/<uuid:assistance_Id>', views.adminDeleteLivingAssistance),

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