from django.shortcuts import render

# Create your views here.

    # Home Page
def index(request):
    return render(request, 'index.html')

    # Authentication
def admin(request):
    return render(request, 'Administrator.html')
    
def login(request):
    return render(request, 'login.html')

    # Services
def services_view(request):
    return render(request, 'services.html')

    # Student Dashboard
def dashboard(request):
    pagename_value = "Dashboard"
    return render(request, 'student/dashboard.html',{'pagename': pagename_value})

    # General Information and Services
def geninfo(request):
    pagename_value = "General Information and Services"
    return render(request, 'student/GenInfoandServices/geninfo.html',{'pagename': pagename_value})

    # Student Support and Counseling
def counselling(request):
    pagename_value = "Student Counselling and Support"
    return render(request, 'student/StudentCounselling/counselling.html',{'pagename': pagename_value})

    # Financial Aid and Scholarships
def financialaid(request):
    pagename_value = "Financial Aid and Scholarships"
    return render(request, 'student/FinancialAid/financialaid.html',{'pagename': pagename_value})

def scholarship_form(request):
    return render(request, 'scholarship.html')

    # Housing and Accommodation
def housing(request):
    pagename_value = "Housing and Accommodation"
    return render(request, 'student/HousingAndAccomodation/housing.html',{'pagename': pagename_value})

    # Health and Wellness Support
def healthwellness(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/healthwellness.html',{'pagename': pagename_value})

    # Career Services and Employment
def careers(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/careers.html',{'pagename': pagename_value})

    # Student IDs and Access Cards
def idandcard(request):
    pagename_value = "Student ID and Access Cards"
    return render(request, 'student/IDandCard/idandcard.html',{'pagename': pagename_value})

    # Student Government and Involvement
def government(request):
    pagename_value = "Student Government and Involvement"
    return render(request, 'student/StudentGovernment/studgovernment.html',{'pagename': pagename_value})

    # Transportation and Parking
def parking(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/parking.html',{'pagename': pagename_value})

    # Lost annd Found Services
def LostAndFound(request):
    pagename_value = "Lost And Found"
    return render(request, 'student/LostAndFoundServices/LostAndFound.html',{'pagename': pagename_value})

def lost_and_found_views(request):
    return render(request, 'lostandfound.html')

def return_item(request):
    return render(request, 'reportlost.html')

    # Student Feedback and Suggestions
def feedback(request):
    pagename_value = "Student Feedback and Suggestions"
    return render(request, 'student/Feedback/feedback.html',{'pagename': pagename_value})