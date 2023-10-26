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

# Admin Gen Info

def admingeninfoservices(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/adminGenInfo/adminServices.html',{'pagename': pagename_value})

def admingeninfoevents(request):
    pagename_value = "General Information and Services"
    return render(request, 'admin/adminGenInfo/adminEvents.html',{'pagename': pagename_value})


