from django.shortcuts import render, redirect
from api.models import User, AdminProfile

# Create your views here.

    # Admin Dashboard
def admindashboard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Dashboard"
        return render(request, 'admin/dashboard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
    # User Management
def adminusermanagement(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        # Fetch the user credentials
        user = request.user
        
        # Fetch the associated admin profile
        try:
            admin_profile = AdminProfile.objects.get(user_Id=user)
        except AdminProfile.DoesNotExist:
            return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
        
        # Check if user is master admin
        if admin_profile.is_master_admin or admin_profile.is_technician:
            pagename_value = "User Management"
            return render(request, 'admin/UserManagement/usermanagement.html', {'pagename': pagename_value})
        else:
            return render(request, 'HTTPResponse/401.html')  # If not master admin, return 401
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminadminmanagement(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        # Fetch the user credentials
        user = request.user
        
        # Fetch the associated admin profile
        try:
            admin_profile = AdminProfile.objects.get(user_Id=user)
        except AdminProfile.DoesNotExist:
            return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
        
        # Check if user is master admin
        if admin_profile.is_master_admin or admin_profile.is_technician:
            pagename_value = "Admin Management"
            return render(request, 'admin/UserManagement/adminmanagement.html', {'pagename': pagename_value})
        else:
            return render(request, 'HTTPResponse/401.html')  # If not master admin, return 401
    else:
        return render(request, 'HTTPResponse/401.html')


def adminprofile(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Profile"
        return render(request, 'admin/profile.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admineditprofile(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Edit Profile"
        return render(request, 'admin/editprofile.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

# Admin General Info
def admingeninfofacilities(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'admin/GenInfoandServices/facilities.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admingeninfoservices(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'admin/GenInfoandServices/services.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admingeninforesources(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'admin/GenInfoandServices/resources.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admingeninfoevents(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'admin/GenInfoandServices/events.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admingeninforeferrals(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'admin/GenInfoandServices/referrals.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Student Counseling  
def adminSupportCounseling(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'admin/StudentCounseling/counseling.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminAcademicAdvising(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'admin/StudentCounseling/advising.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminSuccessResources(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'admin/StudentCounseling/resources.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Feedbacks and Suggestions
def adminfeedbacks(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Feedbacks"
        return render(request, 'admin/FeedbacksandSuggestions/feedbacks.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminsuggestions(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Suggestions"
        return render(request, 'admin/FeedbacksandSuggestions/suggestions.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')


#ID and Access Cards
def adminIdCard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'admin/IDAndCard/IDAndCard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminIdObtaining(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'admin/IDAndCard/obtaining.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminIdReplacing(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'admin/IDAndCard/replacing.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminAccessCard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'admin/IDAndCard/accesscard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Student Careers and Referrals
def adminCareers(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'admin/studentCareers/careers.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminInternship(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'admin/studentCareers/internship.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminCounseling(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'admin/studentCareers/counseling.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminJobSearch(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'admin/studentCareers/jobsearch.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminAddJobPosting(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'admin/studentCareers/jobposting.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Financial Aid Guide
def adminFinancialAid(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Financial Aid and Scholarships"
        return render(request, 'admin/FinancialAid/financialAid.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminFinancialGuidePosting(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Financial Aid and Scholarships"
        return render(request, 'admin/FinancialAid/addpost.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminFinancialAidDetails(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Financial Aid and Scholarships"
        return render(request, 'admin/FinancialAid/details.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Student Government and Involvement
def adminGovernment(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Student Government and Involvement"
        return render(request, 'admin/StudentGovernment/studgovernment.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

#Health and Wellness Support
def adminhealthwellness(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'admin/HealthWellness/healthwellness.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminhealthwellnessprograms(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'admin/HealthWellness/programs.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminhealthwellnessinsurance(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'admin/HealthWellness/insurance.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

# Housing and Accomodation
def adminhousingassistance(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Housing and Accomodation"
        return render(request, 'admin/HousingAndAccomodation/assistance.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminhousing(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Housing and Accomodation"
        return render(request, 'admin/HousingAndAccomodation/housing.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminhousingreferrals(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Housing and Accomodation"
        return render(request, 'admin/HousingAndAccomodation/referrals.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

# Transportation and Parking
def admintransportation(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'admin/TransportationAndParking/transportation.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admintransportationroutes(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'admin/TransportationAndParking/routes.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admintransportationpermit(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'admin/TransportationAndParking/permit.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def admintransportationregulation(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'admin/TransportationAndParking/regulations.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

# Lost and Found
def adminlostandfound(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'admin/LostAndFound/LostAndFound.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminItemLost(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'admin/LostAndFound/ItemLost.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def adminItemRetrieval(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'admin/LostAndFound/retrieval.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')


#Frequently Asked Questions
def adminFaqs(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Frequently Asked Questions"
        return render(request, 'admin/Faqs/faqs.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

# Ticket
def adminticket(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Ticket Support"
        return render(request, 'admin/Ticket/ticket.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminviewticket(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Ticket Details"
        return render(request, 'admin/Ticket/viewticket.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Charters
def admincharters(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Charters"
        return render(request, 'admin/Charters/charters.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminchartersdetails(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Charters"
        return render(request, 'admin/Charters/details.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Charters
def adminFIS(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Faculty Information"
        return render(request, 'admin/fis/fis.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Knowledgebase
def adminKnowledgebase(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Knowledge"
        return render(request, 'admin/Knowledgebase/knowledgebase.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminCreateKnowledgebase(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Knowledge"
        return render(request, 'admin/Knowledgebase/create.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminEditKnowledgebase(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Knowledge"
        return render(request, 'admin/Knowledgebase/edit.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminTicketRating(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Ticket Ratings"
        return render(request, 'admin/TicketRating/rating.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Request
def adminrequest(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Request"
        return render(request, 'admin/Request/request.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def adminviewrequest(request):
    if request.user.is_anonymous:
        return redirect('login')
    if request.user.is_admin:
        pagename_value = "Request Details"
        return render(request, 'admin/Request/viewrequest.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')