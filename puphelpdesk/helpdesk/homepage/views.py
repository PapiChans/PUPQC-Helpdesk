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
            return redirect('user/dashboard')

    # Authentication
def login(request):
    if request.user.is_anonymous:
        return render(request, 'login.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('user/dashboard')
        
# Error 401
def error_401(request):
    return render(request, 'HTTPResponse/401.html')
 
    # Error 404
def error_404(request, exception=None):
    return render(request, 'HTTPResponse/404.html', status=404)


# Register
def signup(request):
    if request.user.is_anonymous:
        return render(request, 'signup.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('user/dashboard')

def ticketing(request):
    if request.user.is_anonymous:
        return render(request, 'openTicket.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('user/dashboard')
   
def ticketStatus(request):
    if request.user.is_anonymous:
        return render(request, 'ticketStatus.html')
    else:
        if request.user.is_admin:
            return redirect('admin/dashboard')
        else:
            return redirect('user/dashboard')