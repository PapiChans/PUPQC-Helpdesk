from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'index.html')


def services_view(request):
    return render(request, 'services.html')


def lost_and_found_views(request):
    return render(request, 'lostandfound.html')

def admin(request):
    return render(request, 'Administrator.html')

def return_item(request):
    return render(request, 'reportlost.html')

def log_in(request):
    return render(request, 'login.html')

