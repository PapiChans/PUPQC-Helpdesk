from django.conf import settings
from django.shortcuts import render

# Create your views here.

    # Home Page
def index(request):
    return render(request, 'LandingPage/index.html')

    # Authentication
def login(request):
    return render(request, 'login.html')

    # HTTP Response Page
def error401page(request):
    return render(request, 'HTTPResponse/401.html')

def error404page(request):
    return render(request, 'HTTPResponse/404.html')   
   