from django.conf import settings
from django.shortcuts import render, redirect

# Create your views here.

    # Home Page
def index(request):
    if request.user.is_anonymous:
        return render(request, 'LandingPage/index.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('student/dashboard')

    # Authentication
def login(request):
    if request.user.is_anonymous:
        return render(request, 'login.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('student/dashboard')
 
   