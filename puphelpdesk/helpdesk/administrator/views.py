from django.shortcuts import render

# Create your views here.

    # Admin Dashboard
def admindashboard(request):
    pagename_value = "Dashboard"
    return render(request, 'admin/dashboard.html',{'pagename': pagename_value})

def adminprofile(request):
    pagename_value = "Profile"
    return render(request, 'admin/profile.html',{'pagename': pagename_value})

def admineditprofile(request):
    pagename_value = "Edit Profile"
    return render(request, 'admin/editprofile.html',{'pagename': pagename_value})

# Admin General Info
def admingeninfofacilities(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/GenInfoandServices/facilities.html',{'pagename': pagename_value})

def admingeninfoservices(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/GenInfoandServices/services.html',{'pagename': pagename_value})

def admingeninforesources(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/GenInfoandServices/resources.html',{'pagename': pagename_value})

def admingeninfoevents(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/GenInfoandServices/events.html',{'pagename': pagename_value})

def admingeninforeferrals(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/GenInfoandServices/referrals.html',{'pagename': pagename_value})


#Student Counseling
def adminSupportCounseling(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'admin/StudentCounseling/counseling.html',{'pagename': pagename_value})

def adminAcademicAdvising(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'admin/StudentCounseling/advising.html',{'pagename': pagename_value})

def adminSuccessResources(request):
    pagename_value = "Student Counseling and Support"
    return render(request, 'admin/StudentCounseling/resources.html',{'pagename': pagename_value})

#Feedbacks and Suggestions
def adminfeedbacks(request):
    pagename_value = "Feedbacks"
    return render(request, 'admin/FeedbacksandSuggestions/feedbacks.html',{'pagename': pagename_value})

def adminsuggestions(request):
    pagename_value = "Suggestions"
    return render(request, 'admin/FeedbacksandSuggestions/suggestions.html',{'pagename': pagename_value})


#ID and Access Cards

def adminIdCard(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'admin/IDAndCard/IDAndCard.html',{'pagename': pagename_value})

def adminIdObtaining(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'admin/IDAndCard/obtaining.html',{'pagename': pagename_value})

def adminIdReplacing(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'admin/IDAndCard/replacing.html',{'pagename': pagename_value})

def adminAccessCard(request):
    pagename_value = "ID and Access Cards"
    return render(request, 'admin/IDAndCard/accesscard.html',{'pagename': pagename_value})

#Student Careers and Referrals

def adminCareers(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'admin/studentCareers/careers.html',{'pagename': pagename_value})

def adminInternship(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'admin/studentCareers/internship.html',{'pagename': pagename_value})

def adminCounseling(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'admin/studentCareers/counseling.html',{'pagename': pagename_value})

def adminJobSearch(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'admin/studentCareers/jobsearch.html',{'pagename': pagename_value})

def adminAddJobPosting(request):
    pagename_value = "Career Services and Employment"
    return render(request, 'admin/studentCareers/jobposting.html',{'pagename': pagename_value})

#Financial Aid Guide
def adminFinancialAid(request):
    pagename_value = "Financial Aid and Scholarships"
    return render(request, 'admin/FinancialAid/financialAid.html',{'pagename': pagename_value})

def adminFinancialGuidePosting(request):
    pagename_value = "Financial Aid and Scholarships"
    return render(request, 'admin/FinancialAid/addpost.html',{'pagename': pagename_value})

#Student Government and Involvement
def adminGovernment(request):
    pagename_value = "Student Government and Involvement"
    return render(request, 'admin/StudentGovernment/studgovernment.html',{'pagename': pagename_value})

#Health and Wellness Support
def adminhealthwellness(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'admin/HealthWellness/healthwellness.html',{'pagename': pagename_value})

def adminhealthwellnessprograms(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'admin/HealthWellness/programs.html',{'pagename': pagename_value})

def adminhealthwellnessinsurance(request):
    pagename_value = "Health and Wellness Support"
    return render(request, 'admin/HealthWellness/insurance.html',{'pagename': pagename_value})

# Housing and Accomodation
def adminhousingassistance(request):
    pagename_value = "Housing and Accomodation"
    return render(request, 'admin/HousingAndAccomodation/assistance.html',{'pagename': pagename_value})

def adminhousing(request):
    pagename_value = "Housing and Accomodation"
    return render(request, 'admin/HousingAndAccomodation/housing.html',{'pagename': pagename_value})

def adminhousingreferrals(request):
    pagename_value = "Housing and Accomodation"
    return render(request, 'admin/HousingAndAccomodation/referrals.html',{'pagename': pagename_value})

#Frequently Asked Questions
def adminFaqs(request):
    pagename_value = "Frequently Asked Questions"
    return render(request, 'admin/Faqs/faqs.html',{'pagename': pagename_value})




