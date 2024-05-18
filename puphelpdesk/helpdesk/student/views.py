from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import User, UserProfile, AdminProfile
from api.serializers import UserProfileSerializer, AdminProfileSerializer

# Create your views here.

    # Student Dashboard
def dashboard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Dashboard"
        return render(request, 'student/dashboard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def profile(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Profile"
        return render(request, 'student/profile.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def editprofile(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Edit Profile"
        return render(request, 'student/editprofile.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # General Information and Services
def geninfofacilities(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'student/GenInfoandServices/facilities.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def geninfoservices(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'student/GenInfoandServices/services.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def geninforesources(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'student/GenInfoandServices/resources.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def geninfoevents(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'student/GenInfoandServices/events.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def geninforeferrals(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "General Information and Services"
        return render(request, 'student/GenInfoandServices/referrals.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Student Support and Counseling
def studsupportcounseling(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'student/StudentCounseling/counseling.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def studsupportadvising(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'student/StudentCounseling/advising.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def studsupportresources(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Student Counseling and Support"
        return render(request, 'student/StudentCounseling/resources.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Financial Aid and Scholarships
def financialaid(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Financial Aid and Scholarships"
        return render(request, 'student/FinancialAid/financialaid.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def studFinancialAidDetails(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Financial Aid and Scholarships"
        return render(request, 'student/FinancialAid/details.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Housing and Accommodation
def housing(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Housing and Accommodation"
        return render(request, 'student/HousingAndAccomodation/housing.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    

def housingreferrals(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Housing and Accomodation"
        return render(request, 'student/HousingAndAccomodation/referrals.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def housingassistance(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Housing and Accomodation"
        return render(request, 'student/HousingAndAccomodation/assistance.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Health and Wellness Support
def healthwellness(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'student/HealthWellness/healthwellness.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def healthwellnessprograms(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'student/HealthWellness/programs.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def healthwellnessinsurance(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Health and Wellness Support"
        return render(request, 'student/HealthWellness/insurance.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Career Services and Employment
def careers(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'student/StudentCareers/careers.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def internship(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'student/StudentCareers/internship.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def counseling(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'student/StudentCareers/counseling.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def jobsearch(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Career Services and Employment"
        return render(request, 'student/StudentCareers/jobsearch.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Student IDs and Access Cards
def idandcard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Student ID and Access Cards"
        return render(request, 'student/IDandCard/idandcard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def IdObtaining(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'student/IDandCard/obtaining.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def IdReplacing(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'student/IDandCard/replacing.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def AccessCard(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "ID and Access Cards"
        return render(request, 'student/IDandCard/accesscard.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Student Government and Involvement
def government(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Student Government and Involvement"
        return render(request, 'student/StudentGovernment/studgovernment.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Transportation and Parking
def transportation(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'student/TransportationAndParking/transportation.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def transportationroutes(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'student/TransportationAndParking/routes.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def transportationpermit(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'student/TransportationAndParking/permit.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def transportationregulation(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Transportation and Parking"
        return render(request, 'student/TransportationAndParking/regulations.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Lost annd Found Services
def lostAndFound(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'student/LostAndFound/LostAndFound.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def ItemLost(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'student/LostAndFound/ItemLost.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def AddItemLost(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'student/LostAndFound/addItemLost.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

def ItemRetrieval(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Lost and Found"
        return render(request, 'student/LostAndFound/retrieval.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    # Student Feedback and Suggestions
def feedback(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Feedback and Suggestions"
        return render(request, 'student/Feedback/feedback.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')

    #Frequently Asked Questions
def faqs(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Frequently Asked Questions"
        return render(request, 'student/Faqs/faqs.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
    #Frequently Asked Questions
def fis(request):
    if request.user.is_anonymous:
        return redirect('login')
    
    user_type = None
    try:
        user_profile = UserProfile.objects.get(user_Id=request.user.user_Id)
        user_type = user_profile.user_Type
    except UserProfile.DoesNotExist:
        pass

    if user_type == 'External Client' or request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')
    else:
        pagename_value = "FIS Faculty Schedule"
        return render(request, 'student/fis/fis.html', {'pagename': pagename_value, 'user_type': user_type})


#Ticket
def ticket(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Ticket Support"
        return render(request, 'student/Ticket/ticket.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def howtouseticket(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Ticket Support"
        return render(request, 'student/Ticket/howtouse.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def viewticket(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Ticket Details"
        return render(request, 'student/Ticket/viewticket.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Charters
def studcharters(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Charters"
        return render(request, 'student/Charters/charters.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def studchartersdetails(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Charters"
        return render(request, 'student/Charters/details.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
# Knowledgebase
def userknowledgebase(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Knowledgebase"
        return render(request, 'student/Knowledgebase/mainpage.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def userknowledgebasebrowse(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Knowledgebase"
        return render(request, 'student/Knowledgebase/browse.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')
    
def userknowledgebaseview(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        pagename_value = "Knowledgebase"
        return render(request, 'student/Knowledgebase/view.html',{'pagename': pagename_value})
    else:
        return render(request, 'HTTPResponse/401.html')