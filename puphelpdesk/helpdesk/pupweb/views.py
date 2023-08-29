from django.shortcuts import render

# Create your views here.

    # Home Page
def index(request):
    return render(request, 'index.html')

    # Authentication
def admin(request):
    return render(request, 'Administrator.html')
    
def log_in(request):
    return render(request, 'login.html')

    # Services
def services_view(request):
    return render(request, 'services.html')

    # Lost and Found
def lost_and_found_views(request):
    return render(request, 'lostandfound.html')

def return_item(request):
    return render(request, 'reportlost.html')

def scholarship_form(request):
    return render(request, 'scholarship.html')
