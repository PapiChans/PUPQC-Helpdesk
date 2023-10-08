from django.shortcuts import render

# Create your views here.

    # Home Page
def index(request):
    return render(request, 'LandingPage/index.html')

    # Authentication
def login(request):
    return render(request, 'login.html')


   