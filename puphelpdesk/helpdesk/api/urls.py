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

    #Careers and Employment: Job Posting
    path('student/getJobPosting', views.studGetJobPosting),
    path('student/getJobPosting/<job_Posting_Category>', views.studGetJobCategory),
    path('student/getJobPostingInfo/<uuid:job_Posting_Id>', views.studGetJobInfo),
    path('student/getJobPosting/<uuid:job_Posting_Category>', views.studGetJobCategory),

    # Lost and Found: Lost Item Posting
    path('student/addLostItem', views.studAddLostItem),
    path('student/getLostItem', views.studGetLostItem),
    path('student/getLostItemInfo/<uuid:item_Id>', views.studGetLostItemInfo),
    path('student/deleteLostItem/<uuid:item_Id>', views.studDeleteLostItem),
    path('student/editLostItem/<uuid:item_Id>', views.studEditLostItem),
    path('student/replaceLostItemImage/<uuid:item_Id>', views.studReplaceLostItemImage),

    # Feedback and Suggestions
    path('student/submitFeedback', views.studSubmitFeedback),
    path('student/getFeedback', views.studGetFeedback),
    path('student/getFeedbackInfo/<uuid:feedback_Id>', views.studGetFeedbackInfo),
    path('student/deleteFeedback/<uuid:feedback_Id>', views.studDeleteFeedback),

    # Ticket
    path('student/addTicket', views.studAddTicket),
    path('student/getTicketbyUser', views.studGetTicketbyUser),
    path('student/getTicketInfo/<ticket_Number>', views.studGetTicketInfo),
    path('student/addTicketComment', views.studAddTicketComment),
    path('student/getTicketComment/<uuid:ticket_Id>', views.studGetTicketComment),
    path('student/verifyTicketInfo/<ticket_Number>', views.studverifyTicketInfo),
    path('student/submitTicketRating', views.studSubmitTicketRating),
    path('student/ticketReOpen/<ticket_Number>', views.studTicketReOpen),

    #----------------------
    # ADMIN API URLS
    #----------------------

    # Profile
    path('admin/editprofile/<uuid:profile_Id>', views.adminEditProfile),

    # Dashboard
    path('admin/FeedbackVsSuggestions', views.adminFeedbackVsSuggestions),
    path('admin/feedbackChart', views.adminFeedbackChart),
    path('admin/suggestionChart', views.adminSuggestionChart),
    path('admin/careerChart', views.adminCareerChart),
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
    path('admin/getOneAdminProfile/<uuid:profile_Id>', views.adminGetAdminProfile),
    path('admin/editAdminProfile/<uuid:profile_Id>', views.adminEditAdminProfile),

    # General Info and Services: Event
    path('admin/addEvent', views.adminAddEvent),
    path('admin/getEvent', views.adminGetEvent),
    path('admin/getEventInfo/<uuid:event_Id>', views.adminGetEventInfo),
    path('admin/deleteEvent/<uuid:event_Id>', views.adminDeleteEvent),
    path('admin/editEvent/<uuid:event_Id>', views.adminEditEvent),
    path('admin/uploadEventImage/<uuid:event_Id>', views.adminUploadEventImage),
    path('admin/deleteEventImage/<uuid:event_Id>', views.adminDeleteEventImage),

    # Careers and Employment: Job Posting
    path('admin/addJobPosting', views.adminAddJobPosting),
    path('admin/getJobPosting', views.adminGetJobPosting),
    path('admin/getJobPosting/<job_Posting_Category>', views.adminGetJobCategory),
    path('admin/getJobPostingInfo/<uuid:job_Posting_Id>', views.adminGetJobInfo),
    path('admin/editJobPosting/<uuid:job_Posting_Id>', views.adminEditJobPosting),
    path('admin/replaceCompanyLogo/<uuid:job_Posting_Id>', views.adminReplaceCompanyLogo),
    path('admin/deleteJobPosting/<uuid:job_Posting_Id>', views.adminDeleteJobPosting),
    path('admin/getJobPosting/<uuid:job_Posting_Category>', views.adminGetJobCategory),

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

    # Ticket
    path('admin/getPendingTicket', views.adminGetPendingTicket),
    path('admin/getClosedTicket', views.adminGetClosedTicket),
    path('admin/getAllTicket', views.adminGetAllTicket),
    path('admin/getTicketInfo/<ticket_Number>', views.adminGetTicketInfo),
    path('admin/getTicketComment/<uuid:ticket_Id>', views.adminGetTicketComment),
    path('admin/addTicketComment', views.adminAddTicketComment),
    path('admin/ticketClosed/<uuid:ticket_Id>', views.adminCloseTicket),
    path('admin/verifyTicketInfo/<ticket_Number>', views.adminverifyTicketInfo),
    path('admin/editTicket/<uuid:ticket_Id>', views.adminEditTicket),
    path('admin/sortTickets', views.adminSortTickets),

    # Ticket Rating
    path('admin/getAllTicketRating', views.adminGetAllTicketRating),
    path('admin/sortTicketRatings', views.adminSortTicketRatings),

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
    path('admin/searchKnowledge/<knowledge_Keyword>', views.adminSearchKnowledge),

    # Request
    path('admin/addTicketRequest', views.adminAddTicketRequest),
    path('admin/getMNRequest', views.adminGetMNRequest),
    path('admin/getMYRequest', views.adminGetMYRequest),
    path('admin/sortRequests', views.adminSortRequest),
    path('admin/getRequestInfo/<request_Number>', views.adminGetRequestInfo),
    path('admin/getRequestComment/<uuid:request_Id>', views.adminGetRequestComment),
    path('admin/addRequestComment', views.adminAddRequestComment),
    path('admin/submitRequestRating/<request_Number>', views.adminSubmitRequestRating),
    path('admin/requestClosed/<uuid:request_Id>', views.adminCloseRequest),

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
    path('guest/searchKnowledge/<knowledge_Keyword>', views.guestSearchKnowledge),

    # Audit Trail
    path('admin/getAuditTrail/<ticket_Number>', views.adminGetAuditTrail),

    #----------------------
    # REPORTS API URLS
    #----------------------

    path('report/masteradminmonthlyticketreport', views.masteradminMonthlyOfficeTicketReport, name='report/masteradminmonthlyticketreport'),
    path('report/masteradminmonthlyticketratings', views.masteradminMonthlyOfficeTicketRatings, name='report/masteradminmonthlyticketratings'),
    path('report/masteradminmonthlyrequestreport', views.masteradminMonthlyOfficeRequestReport, name='report/masteradminmonthlyrequestreport'),
    path('report/masteradminevaluationreport', views.masteradminMonthlyEvaluationReport, name='report/masteradminevaluationreport'),
    path('report/adminmonthlyreport', views.adminMonthlyReport, name='report/adminmonthlyreport'),

    # Evaluation
    path('verifyEvaluationID/<uuid:eval_Id>', views.evalVerifyID),
    path('submitEvaluation/<uuid:eval_Id>', views.evalSubmit),
]
