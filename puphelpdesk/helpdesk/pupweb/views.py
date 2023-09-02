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

    # Financial Aid and Scholarships
def scholarship_form(request):
    return render(request, 'scholarship.html')

    # Housing and Accommodation

    # Health and Wellness Support

    # Career Services and Employment

    # Student IDs and Access Cards

    # Student Government and Involvement

    # Transportation and Parking

    # Lost annd Found Services
def lost_and_found_views(request):
    return render(request, 'lostandfound.html')

def return_item(request):
    return render(request, 'reportlost.html')

    # Student Feedback and Suggestions