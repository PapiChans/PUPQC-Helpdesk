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
    pagename_value = "Facilities"
    return render(request, 'admin/GenInfoandServices/facilities.html',{'pagename': pagename_value})

def admingeninfoservices(request):
    pagename_value = "Services"
    return render(request, 'admin/GenInfoandServices/services.html',{'pagename': pagename_value})

def admingeninforesources(request):
    pagename_value = "Resources"
    return render(request, 'admin/GenInfoandServices/resources.html',{'pagename': pagename_value})

def admingeninfoevents(request):
    pagename_value = "Events"
    return render(request, 'admin/GenInfoandServices/events.html',{'pagename': pagename_value})

def admingeninforeferrals(request):
    pagename_value = "Referrals"
    return render(request, 'admin/GenInfoandServices/referrals.html',{'pagename': pagename_value})


#Student Counseling
def adminSuccessResources(request):
    pagename_value = "Success Resources"
    return render(request, 'admin/StudentCounseling/successResources.html',{'pagename': pagename_value})

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




