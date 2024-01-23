from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

@api_view(['POST'])
def authlogin(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        checkuser = User.objects.filter(username = username).exists()
        if checkuser:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
            else:
                return Response({"response": "Incorrect Password"})
        else:
            return Response({"response": "User does not exist"})

    return Response({"response": "Success", "admin": request.user.is_admin})