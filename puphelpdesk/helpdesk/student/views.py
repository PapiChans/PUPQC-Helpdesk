from django.shortcuts import render

# Create your views here.

    # Student Dashboard
def dashboard(request):
    pagename_value = "Dashboard"
    return render(request, 'student/dashboard.html',{'pagename': pagename_value})

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

    # Housing and Accommodation
def housing(request):
    pagename_value = "Housing and Accommodation"
    return render(request, 'student/HousingAndAccomodation/housing.html',{'pagename': pagename_value})

def housingreferrals(request):
    pagename_value = "Housing and Accomodation"
    return render(request, 'student/HousingAndAccomodation/referrals.html',{'pagename': pagename_value})

def housingassistance(request):
    pagename_value = "Housing and Accomodation"
    return render(request, 'student/HousingAndAccomodation/assistance.html',{'pagename': pagename_value})

    # Health and Wellness Support
def healthwellness(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/healthwellness.html',{'pagename': pagename_value})

def healthwellnessprograms(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/programs.html',{'pagename': pagename_value})

def healthwellnessinsurance(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'student/HealthWellness/insurance.html',{'pagename': pagename_value})

    # Career Services and Employment
def careers(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/careers.html',{'pagename': pagename_value})

def internship(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/internship.html',{'pagename': pagename_value})

def counseling(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/counseling.html',{'pagename': pagename_value})

def jobsearch(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'student/StudentCareers/jobsearch.html',{'pagename': pagename_value})

    # Student IDs and Access Cards
def idandcard(request):
    pagename_value = "Student ID and Access Cards"
    return render(request, 'student/IDandCard/idandcard.html',{'pagename': pagename_value})

def IdObtaining(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'student/IDAndCard/obtaining.html',{'pagename': pagename_value})

def IdReplacing(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'student/IDAndCard/replacing.html',{'pagename': pagename_value})

def AccessCard(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'student/IDAndCard/accesscard.html',{'pagename': pagename_value})

    # Student Government and Involvement
def government(request):
    pagename_value = "Student Government and Involvement"
    return render(request, 'student/StudentGovernment/studgovernment.html',{'pagename': pagename_value})

    # Transportation and Parking
def transportation(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/transportation.html',{'pagename': pagename_value})

def transportationroutes(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/routes.html',{'pagename': pagename_value})

def transportationpermit(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/permit.html',{'pagename': pagename_value})

def transportationregulation(request):
    pagename_value = "Transportation and Parking"
    return render(request, 'student/TransportationAndParking/regulations.html',{'pagename': pagename_value})

    # Lost annd Found Services
def lostAndFound(request):
    pagename_value = "Lost And Found"
    return render(request, 'student/LostAndFoundServices/LostAndFound.html',{'pagename': pagename_value})

def returnItems(request):
    pagename_value = "Lost And Found"
    return render(request, 'student/LostAndFoundServices/NewReportLost.html',{'pagename': pagename_value})

def item_list(request):
    pagename_value = "Lost And Found"
    return render(request, 'student/LostAndFoundServices/itemList.html', {'pagename': pagename_value})

    # Student Feedback and Suggestions
def feedback(request):
    pagename_value = "Feedback and Suggestions"
    return render(request, 'student/Feedback/feedback.html',{'pagename': pagename_value})

    #Frequently Asked Questions
def faqs(request):
    pagename_value = "Frequently Asked Questions"
    return render(request, 'student/Faqs/faqs.html',{'pagename': pagename_value})

