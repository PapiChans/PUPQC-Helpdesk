from django.shortcuts import render

# Create your views here.

    # Home Page
def index(request):
    return render(request, 'index.html')

    #---------------------------------------------
    # Student
    #---------------------------------------------

    # Authentication
def login(request):
    return render(request, 'login.html')

    # Services
def services_view(request):
    return render(request, 'services.html')

    # Student Dashboard
def dashboard(request):
    pagename_value = "Dashboard"
    return render(request, 'student/dashboard.html',{'pagename': pagename_value})

def dashboard2(request):
    pagename_value = "Dashboard"
    return render(request, 'student/dashboard2.html',{'pagename': pagename_value})

def tickets(request):
    pagename_value = "Your Tickets"
    return render(request, 'student/tickets.html',{'pagename': pagename_value})

def profile(request):
    pagename_value = "Profile"
    return render(request, 'student/profile.html',{'pagename': pagename_value})

def editprofile(request):
    pagename_value = "Edit Profile"
    return render(request, 'student/editprofile.html',{'pagename': pagename_value})

    # General Information and Services
def geninfofacilities(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/facilities.html',{'pagename': pagename_value})

def geninfoservices(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/services.html',{'pagename': pagename_value})

def geninforesources(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/resources.html',{'pagename': pagename_value})

def geninfoevents(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/events.html',{'pagename': pagename_value})

def geninforeferrals(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/referrals.html',{'pagename': pagename_value})

    # Student Support and Counseling
def studsupportcounseling(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'student/StudentCounseling/counseling.html',{'pagename': pagename_value})

def studsupportadvising(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'student/StudentCounseling/advising.html',{'pagename': pagename_value})

def studsupportresources(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'student/StudentCounseling/resources.html',{'pagename': pagename_value})

    # Financial Aid and Scholarships
def financialaid(request):
    pagename_value = "Financial Aid and Scholarships"
    return render(request, 'student/FinancialAid/financialaid.html',{'pagename': pagename_value})

def financialguidance(request):
    pagename_value = "Financial Aid and Scholarships"
    return render(request, 'student/FinancialAid/financialguidance.html',{'pagename': pagename_value})

def scholarshipForm(request):
    pagename_value = "Scholarship Application Form"
    return render(request, 'student/FinancialAid/scholarshipform.html',{'pagename': pagename_value})

    # Housing and Accommodation
def housing(request):
    pagename_value = "Housing and Accommodation"
    return render(request, 'student/HousingAndAccomodation/housing.html',{'pagename': pagename_value})

    # Health and Wellness Support
def healthwellness(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/healthwellness.html',{'pagename': pagename_value})

def healthServices(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/healthServices.html',{'pagename': pagename_value})

    # Career Services and Employment
def careers(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/careers.html',{'pagename': pagename_value})

def referrals(request):
    pagename_value = "Career Counseling Referrals"
    return render(request, 'student/StudentCareers/referrals.html',{'pagename': pagename_value})

def internship(request):
    pagename_value = "Internship"
    return render(request, 'student/StudentCareers/internship.html',{'pagename': pagename_value})

    # Student IDs and Access Cards
def idandcard(request):
    pagename_value = "Student ID and Access Cards"
    return render(request, 'student/IDandCard/idandcard.html',{'pagename': pagename_value})

def newIdRequest(request):
    pagename_value = "Student ID and Access Cards"
    return render(request, 'student/IDandCard/IDrequest.html',{'pagename': pagename_value})

def IDvalidation(request):
    pagename_value = "Student ID and Access Cards"
    return render(request, 'student/IDandCard/IDvalidation.html',{'pagename': pagename_value})

    # Student Government and Involvement
def government(request):
    pagename_value = "Student Government and Involvement"
    return render(request, 'student/StudentGovernment/studgovernment.html',{'pagename': pagename_value})

    # Transportation and Parking
def parking(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/parking.html',{'pagename': pagename_value})

def parkingSlot(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/slotReserve.html',{'pagename': pagename_value})


def transportInfo(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/transportInfo.html',{'pagename': pagename_value})

    # Lost annd Found Services
def lostandfound(request):
    pagename_value = "Lost And Found"
    return render(request, 'student/LostAndFoundServices/LostAndFound.html',{'pagename': pagename_value})

def returnItems(request):
    pagename_value = "Return Items"
    return render(request, 'student/LostAndFoundServices/NewReportLost.html',{'pagename': pagename_value})

def lost_and_found_views(request):
    return render(request, 'lostandfound.html')

def return_item(request):
    return render(request, 'reportlost.html')

    # Student Feedback and Suggestions
def feedback(request):
    pagename_value = "Student Feedback and Suggestions"
    return render(request, 'student/Feedback/feedback.html',{'pagename': pagename_value})


    #---------------------------------------------
    # Admin
    #---------------------------------------------

def admindashboard(request):
    pagename_value = "Dashboard"
    return render(request, 'admin/dashboard.html',{'pagename': pagename_value})

def adminprofile(request):
    pagename_value = "Profile"
    return render(request, 'admin/profile.html',{'pagename': pagename_value})

def admineditprofile(request):
    pagename_value = "Edit Profile"
    return render(request, 'admin/editprofile.html',{'pagename': pagename_value})