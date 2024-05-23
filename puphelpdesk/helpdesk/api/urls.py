from django.urls import include, path
from . import views

urlpatterns = [

    #----------------------
    # AUTHENTICATION
    #----------------------
    path('auth/signup', views.signup),
    path('auth/login', views.authlogin),
    path('auth/logout', views.user_logout),
    path('auth/getuserprofile', views.getUserProfile),
    path('auth/getadminprofile', views.getAdminProfile),
    
    #----------------------
    # STUDENT API URLS
    #----------------------

    # Profile
    path('student/editprofile/<uuid:profile_Id>', views.studEditProfile),

    # Dashboard
    path('student/dashboard-event', views.studfetchEvent),
    path('student/dashboard-jobpost', views.studfetchJobPosting),
    path('student/dashboard-lostitem', views.studfetchLostItem),

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
    # (Inactive) path('student/getAcademicAdviser', views.studGetAcademicAdviser),
    # (Inactive) path('student/getAcademicAdviserInfo/<uuid:adviser_Id>', views.studGetAcademicAdviserInfo),

    # Student Support and Counseling: Success Resources
    # (Inactive) path('student/getSuccessResources', views.studGetSuccessResources),

    #Financial Aid and Scholarship
    path('student/getFinancialAid', views.studGetFinancialAid),
    path('student/getScholarship', views.studGetScholarships),
    path('student/getGuideInfo/<guide_Number>', views.studGetGuideInfo),

    # Careers and Employment: Career Counseling
    path('student/getCounseling', views.studGetCounseling),
    path('student/getCounselingInfo/<uuid:counseling_Id>', views.studGetCounselingInfo),

    # Careers and Employment: Job Search Resources
    path('student/getJobSearch', views.studGetJobSearch),

    #Careers and Employment: Job Posting
    path('student/getJobPosting', views.studGetJobPosting),
    path('student/getJobPosting/<job_Posting_Category>', views.studGetJobCategory),
    path('student/getJobPostingInfo/<uuid:job_Posting_Id>', views.studGetJobInfo),
    path('student/getJobPosting/<uuid:job_Posting_Category>', views.studGetJobCategory),

    # ID and Access Cards
    # (Inactive) path('student/getObtainingStep', views.studGetObtainingStep),
    # (Inactive) path('student/getReplacingStep', views.studGetReplacingStep),
    # (Inactive) path('student/getAccessCardStep', views.studGetAccessCardStep),

    # Student Government and Involvement
    # (Inactive) path('student/getGovernment', views.studGetGovernment),
    # (Inactive) path('student/getGovernmentInfo/<uuid:government_Id>', views.studGetGovernmentInfo),

    # Health and Wellness Programs: Health Service Referrals
    # (Inactive) path('student/getHealthFacility', views.studGetHealthFacility),
    # (Inactive) path('student/getHealthFacilityInfo/<uuid:health_Facility_Id>', views.studGetHealthFacilityInfo),

    # Health and Wellness Programs: Health Insurance
    # (Inactive) path('student/getHealthInsurance', views.studGetHealthInsurance),
    # (Inactive) path('student/getHealthInsuranceInfo/<uuid:health_Insurance_Id>', views.studGetHealthInsuranceInfo),

    # Housing and Accomodation: Housing Options Referrals
    # (Inactive) path('student/getHousingReferrals', views.studGetHousingReferrals),
    # (Inactive) path('student/getHousingReferralsInfo/<uuid:housing_Id>', views.studGetHousingReferralsInfo),

    # Housing and Accomodation: Off-Campus Living Assistance
    # (Inactive) path('student/getLivingAssistance', views.studGetLivingAssistance),

    # Transportation and Parking: Campus Parking Permits
    # (Inactive) path('student/getPermit', views.studGetPermit),
    # (Inactive) path('student/getPermitInfo/<uuid:permit_Id>', views.studGetPermitInfo),

    # Transportation and Parking: Campus Parking Regulation
    # (Inactive) path('student/getRegulation', views.studGetRegulation),

    # Transportation and Parking: Transporation Options
    # (Inactive) path('student/getTransport', views.studGetTransport),
    # (Inactive) path('student/getTransportInfo/<uuid:transport_Id>', views.studGetTransportInfo),

    # Lost and Found: Lost Item Posting
    path('student/addLostItem', views.studAddLostItem),
    path('student/getLostItem', views.studGetLostItem),
    path('student/getLostItemInfo/<uuid:item_Id>', views.studGetLostItemInfo),
    path('student/deleteLostItem/<uuid:item_Id>', views.studDeleteLostItem),
    path('student/editLostItem/<uuid:item_Id>', views.studEditLostItem),
    path('student/replaceLostItemImage/<uuid:item_Id>', views.studReplaceLostItemImage),

    # Lost and Found: Retrieval Instruction
    path('student/getInstruction', views.studGetInstruction),

    # Feedback and Suggestions
    path('student/submitFeedback', views.studSubmitFeedback),
    path('student/getFeedback', views.studGetFeedback),
    path('student/getFeedbackInfo/<uuid:feedback_Id>', views.studGetFeedbackInfo),
    path('student/deleteFeedback/<uuid:feedback_Id>', views.studDeleteFeedback),

    # FAQ
    path('student/getFAQ', views.studGetFAQ),

    # Ticket
    path('student/addTicket', views.studAddTicket),
    path('student/getTicketbyUser', views.studGetTicketbyUser),
    path('student/getTicketInfo/<ticket_Number>', views.studGetTicketInfo),
    path('student/addTicketComment', views.studAddTicketComment),
    path('student/getTicketComment/<uuid:ticket_Id>', views.studGetTicketComment),
    path('student/getTicketFAQ', views.studGetTicketFAQ),
    path('student/verifyTicketInfo/<ticket_Number>', views.studverifyTicketInfo),

    # Charters
    path('student/getCharter', views.studGetCharter),
    path('student/getCharter/<charter_Category>', views.studGetCharterCategory),
    path('student/getCharterInfo/<uuid:charter_Id>', views.studGetCharterInfo),
    path('student/getCharterNumberInfo/<charter_Number>', views.studGetCharterNumberInfo),
    path('student/searchCharter/<charter_Keyword>', views.studSearchCharter),

    # Charter Step
    path('student/getCharterStep/<charter_Id>', views.studGetCharterStep),
    path('student/getCharterStepInfo/<uuid:step_Id>', views.studGetCharterStepInfo),

    #----------------------
    # ADMIN API URLS
    #----------------------

    # Profile
    path('admin/editprofile/<uuid:profile_Id>', views.adminEditProfile),

    # Dashboard
    path('admin/FeedbackVsSuggestions', views.adminFeedbackVsSuggestions),
    path('admin/feedbackChart', views.adminFeedbackChart),
    path('admin/suggestionChart', views.adminSuggestionChart),
    path('admin/financialaidChart', views.adminFinancialAidChart),
    path('admin/careerChart', views.adminCareerChart),
    path('admin/studentgovernmentChart', views.adminStudentGovernmentChart),
    path('admin/ticketstatusChart', views.adminTicketStatusChart),
    path('admin/getTicketCount', views.adminGetTicketCount),
    path('admin/getFeedbacksCount', views.adminGetFeedbacksCount),
    path('admin/updateTicketPriority', views.updateTicketPriority),
    path('admin/updateTicketStatus', views.updateTicketStatus),

    # User Management
    path('admin/getUserManagement', views.adminGetUserManagement),
    path('admin/getAdminManagement', views.adminGetAdminManagement),
    path('admin/addStudent', views.adminAddStudent),
    path('admin/addAdmin', views.adminAddAdmin),

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
    # (Inactive) path('admin/addSupportCounselor', views.adminAddSupportCounselor),
    # (Inactive) path('admin/getSupportCounselor', views.adminGetSupportCounselor),
    # (Inactive) path('admin/getSupportCounselorInfo/<uuid:counselor_Id>', views.adminGetSupportCounselorInfo),
    # (Inactive) path('admin/editSupportCounselor/<uuid:counselor_Id>', views.adminEditSupportCounselor),
    # (Inactive) path('admin/deleteSupportCounselor/<uuid:counselor_Id>', views.adminDeleteSupportCounselor),

    # Student Support and Counseling: Academic Advising
    # (Inactive) path('admin/addAcademicAdviser', views.adminAddAcademicAdviser),
    # (Inactive) path('admin/getAcademicAdviser', views.adminGetAcademicAdviser),
    # (Inactive) path('admin/getAcademicAdviserInfo/<uuid:adviser_Id>', views.adminGetAcademicAdviserInfo),
    # (Inactive) path('admin/editAcademicAdviser/<uuid:adviser_Id>', views.adminEditAcademicAdviser),
    # (Inactive) path('admin/deleteAcademicAdviser/<uuid:adviser_Id>', views.adminDeleteAcademicAdviser),

    # Student Support and Counseling: Success Resources
    # (Inactive) path('admin/addSuccessResources', views.adminAddSuccessResources),
    # (Inactive) path('admin/getSuccessResources', views.adminGetSuccessResources),
    # (Inactive) path('admin/deleteSuccessResources/<uuid:success_resources_Id>', views.adminDeleteSuccessResources),

    #Financial Aid and Scholarship
    path('admin/addFinancialGuide', views.adminAddGuidePost),
    path('admin/getFinancialAid', views.adminGetFinancialAid),
    path('admin/getScholarship', views.adminGetScholarships),
    path('admin/getGuideInfoEdit/<guide_Id>', views.adminGetGuideInfoEdit),
    path('admin/getGuideInfo/<guide_Number>', views.adminGetGuideInfo),
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
    path('admin/getJobPosting/<job_Posting_Category>', views.adminGetJobCategory),
    path('admin/getJobPostingInfo/<uuid:job_Posting_Id>', views.adminGetJobInfo),
    path('admin/editJobPosting/<uuid:job_Posting_Id>', views.adminEditJobPosting),
    path('admin/replaceCompanyLogo/<uuid:job_Posting_Id>', views.adminReplaceCompanyLogo),
    path('admin/deleteJobPosting/<uuid:job_Posting_Id>', views.adminDeleteJobPosting),
    path('admin/getJobPosting/<uuid:job_Posting_Category>', views.adminGetJobCategory),

    # ID and Access Cards
    # (Inactive) path('admin/addObtainingStep', views.adminAddObtainingStep),
    # (Inactive) path('admin/addReplacingStep', views.adminAddReplacingStep),
    # (Inactive) path('admin/addAccessCardStep', views.adminAddAccessCardStep),
    # (Inactive) path('admin/getObtainingStep', views.adminGetObtainingStep),
    # (Inactive) path('admin/getReplacingStep', views.adminGetReplacingStep),
    # (Inactive) path('admin/getAccessCardStep', views.adminGetAccessCardStep),
    # (Inactive) path('admin/getStepInfo/<uuid:guide_Id>', views.adminGetStepInfo),
    # (Inactive) path('admin/editGuideStep/<uuid:guide_Id>', views.adminEditGuide),
    # (Inactive) path('admin/deleteGuideStep/<uuid:guide_Id>', views.adminDeleteGuide),

    # Student Government and Involvement
    # (Inactive) path('admin/addGovernment', views.adminAddGovernment),
    # (Inactive) path('admin/getGovernment', views.adminGetGovernment),
    # (Inactive) path('admin/getGovernmentInfo/<uuid:government_Id>', views.adminGetGovernmentInfo),
    # (Inactive) path('admin/editGovernment/<uuid:government_Id>', views.adminEditGovernment),
    # (Inactive) path('admin/deleteGovernment/<uuid:government_Id>', views.adminDeleteGovernment),

    # Health and Wellness Programs: Health Service Referrals
    # (Inactive) path('admin/addHealthFacility', views.adminAddHealthFacility),
    # (Inactive) path('admin/getHealthFacility', views.adminGetHealthFacility),
    # (Inactive) path('admin/getHealthFacilityInfo/<uuid:health_Facility_Id>', views.adminGetHealthFacilityInfo),
    # (Inactive) path('admin/editHealthFacility/<uuid:health_Facility_Id>', views.adminEditHealthFacility),
    # (Inactive) path('admin/deleteHealthFacility/<uuid:health_Facility_Id>', views.adminDeleteHealthFacility),

    # Health and Wellness Programs: Health Insurance
    # (Inactive) path('admin/addHealthInsurance', views.adminAddHealthInsurance),
    # (Inactive) path('admin/getHealthInsurance', views.adminGetHealthInsurance),
    # (Inactive) path('admin/getHealthInsuranceInfo/<uuid:health_Insurance_Id>', views.adminGetHealthInsuranceInfo),
    # (Inactive) path('admin/editHealthInsurance/<uuid:health_Insurance_Id>', views.adminEditHealthInsurance),
    # (Inactive) path('admin/deleteHealthInsurance/<uuid:health_Insurance_Id>', views.adminDeleteHealthInsurance),

    # Housing and Accomodation: Housing Options Referrals
    # (Inactive) path('admin/addHousingReferrals', views.adminAddHousingReferrals),
    # (Inactive) path('admin/getHousingReferrals', views.adminGetHousingReferrals),
    # (Inactive) path('admin/getHousingReferralsInfo/<uuid:housing_Id>', views.adminGetHousingReferralsInfo),
    # (Inactive) path('admin/editHousingReferrals/<uuid:housing_Id>', views.adminEditHousingReferrals),
    # (Inactive) path('admin/replaceHousingReferralsImage/<uuid:housing_Id>', views.adminReplaceHousingReferralsImage),
    # (Inactive) path('admin/deleteHousingReferrals/<uuid:housing_Id>', views.adminDeleteHousingReferrals),

    # Housing and Accomodation: Off-Campus Living Assistance
    # (Inactive) path('admin/addLivingAssistance', views.adminAddLivingAssistance),
    # (Inactive) path('admin/getLivingAssistance', views.adminGetLivingAssistance),
    # (Inactive) path('admin/getLivingAssistanceInfo/<uuid:assistance_Id>', views.adminGetLivingAssistanceInfo),
    # (Inactive) path('admin/editLivingAssistance/<uuid:assistance_Id>', views.adminEditLivingAssistance),
    # (Inactive) path('admin/deleteLivingAssistance/<uuid:assistance_Id>', views.adminDeleteLivingAssistance),

    # Transportation and Parking: Campus Parking Permits
    # (Inactive) path('admin/addPermit', views.adminAddPermit),
    # (Inactive) path('admin/getPermit', views.adminGetPermit),
    # (Inactive) path('admin/getPermitInfo/<uuid:permit_Id>', views.adminGetPermitInfo),
    # (Inactive) path('admin/editPermit/<uuid:permit_Id>', views.adminEditPermit),
    # (Inactive) path('admin/deletePermit/<uuid:permit_Id>', views.adminDeletePermit),

    # Transportation and Parking: Campus Parking Regulation
    # (Inactive) path('admin/addRegulation', views.adminAddRegulation),
    # (Inactive) path('admin/getRegulation', views.adminGetRegulation),
    # (Inactive) path('admin/getRegulationInfo/<uuid:regulation_Id>', views.adminGetRegulationInfo),
    # (Inactive) path('admin/editRegulation/<uuid:regulation_Id>', views.adminEditRegulation),
    # (Inactive) path('admin/deleteRegulation/<uuid:regulation_Id>', views.adminDeleteRegulation),

    # Transportation and Parking: Transporation Options
    # (Inactive) path('admin/addTransport', views.adminAddTransport),
    # (Inactive) path('admin/getTransport', views.adminGetTransport),
    # (Inactive) path('admin/getTransportInfo/<uuid:transport_Id>', views.adminGetTransportInfo),
    # (Inactive) path('admin/editTransport/<uuid:transport_Id>', views.adminEditTransport),
    # (Inactive) path('admin/deleteTransport/<uuid:transport_Id>', views.adminDeleteTransport),

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

    # Lost and Found: Lost Item Posting
    path('admin/getLostItem', views.adminGetLostItem),
    path('admin/getLostItemInfo/<uuid:item_Id>', views.adminGetLostItemInfo),
    path('admin/ItemMarkAsMissing/<uuid:item_Id>', views.adminItemMarkAsMissing),
    path('admin/ItemMarkAsClaim/<uuid:item_Id>', views.adminItemMarkAsClaim),
    path('admin/ItemMarkAsFound/<uuid:item_Id>', views.adminItemMarkAsFound),
    path('admin/searchItem/<item_Keyword>', views.adminSearchItem),

    # Lost and Found: Retrieval Instruction
    path('admin/addInstruction', views.adminAddInstruction),
    path('admin/getInstruction', views.adminGetInstruction),
    path('admin/getInstructionInfo/<uuid:instruction_Id>', views.adminGetInstructionInfo),
    path('admin/editInstruction/<uuid:instruction_Id>', views.adminEditInstruction),
    path('admin/deleteInstruction/<uuid:instruction_Id>', views.adminDeleteInstruction),

    # FAQ
    path('admin/addFAQ', views.adminAddFAQ),
    path('admin/getFAQ', views.adminGetFAQ),
    path('admin/getFAQInfo/<uuid:FAQ_Id>', views.adminGetFAQInfo),
    path('admin/editFAQ/<uuid:FAQ_Id>', views.adminEditFAQ),
    path('admin/deleteFAQ/<uuid:FAQ_Id>', views.adminDeleteFAQ),

    # Ticket
    path('admin/getPendingTicket', views.adminGetPendingTicket),
    path('admin/getResponseTicket', views.adminGetResponseTicket),
    path('admin/getClosedTicket', views.adminGetClosedTicket),
    path('admin/getAllTicket', views.adminGetAllTicket),
    path('admin/getTicketInfo/<ticket_Number>', views.adminGetTicketInfo),
    path('admin/getTicketComment/<uuid:ticket_Id>', views.adminGetTicketComment),
    path('admin/addTicketComment', views.adminAddTicketComment),
    path('admin/ticketClosed/<uuid:ticket_Id>', views.adminCloseTicket),
    path('admin/verifyTicketInfo/<ticket_Number>', views.adminverifyTicketInfo),

    # Charters
    path('admin/addCharter', views.adminAddCharter),
    path('admin/getCharter', views.adminGetCharter),
    path('admin/getCharter/<charter_Category>', views.adminGetCharterCategory),
    path('admin/getCharterInfo/<uuid:charter_Id>', views.adminGetCharterInfo),
    path('admin/getCharterNumberInfo/<charter_Number>', views.adminGetCharterNumberInfo),
    path('admin/editCharter/<uuid:charter_Id>', views.adminEditCharter),
    path('admin/deleteCharter/<uuid:charter_Id>', views.adminDeleteCharter),
    path('admin/searchCharter/<charter_Keyword>', views.adminSearchCharter),

    # Charter Step
    path('admin/addCharterStep', views.adminAddCharterStep),
    path('admin/getCharterStep/<charter_Id>', views.adminGetCharterStep),
    path('admin/getCharterStepInfo/<uuid:step_Id>', views.adminGetCharterStepInfo),
    path('admin/editCharterStep/<uuid:step_Id>', views.adminEditCharterStep),
    path('admin/deleteCharterStep/<uuid:step_Id>', views.adminDeleteCharterStep),

    # Knowledgebase: Folder
    path('admin/addKBFolder', views.adminAddKBFolder),
    path('admin/getKBFolder', views.adminGetKBFolder),
    path('admin/getKBFolderInfo/<uuid:folder_Id>', views.adminGetKBFolderInfo),
    path('admin/editKBFolder/<uuid:folder_Id>', views.adminEditKBFolder),
    path('admin/deleteKBFolder/<uuid:folder_Id>', views.adminDeleteKBFolder),

    #Knowledgebase: Topic
    path('admin/addKBTopic', views.adminAddKBTopic),
    path('admin/getKBTopic/<uuid:folder_Id>', views.adminGetKBTopic),
    path('admin/getKBTopicInfo/<topic_Number>', views.adminGetKBTopicInfo),
    path('admin/editKBTopic/<topic_Number>', views.adminEditKBTopic),
    path('admin/deleteKBTopic/<topic_Number>', views.adminDeleteKBTopic),

    #----------------------
    # GUEST API URLS
    #----------------------

    # Knowledgebase
    path('guest/getKBFolder', views.guestGetKBFolder),
    path('guest/getKBFolderInfo/<folder_Id>', views.guestGetKBFolderInfo),
    path('guest/getKBFolderbyName/<folder_Name>', views.guestGetKBFolderbyName),
    path('guest/getKBTopic/<uuid:folder_Id>', views.guestGetKBTopic),
    path('guest/getKBTopicInfo/<topic_Number>', views.guestGetKBTopicInfo),
    path('guest/putKBTopicLike/<topic_Number>', views.guestPUTKBTopicLike),
    path('guest/putKBTopicDislike/<topic_Number>', views.guestPUTKBTopicDislike),
]
