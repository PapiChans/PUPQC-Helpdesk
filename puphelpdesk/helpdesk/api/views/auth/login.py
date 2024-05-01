from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.utils import timezone

@api_view(['POST'])
def authlogin(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = User.objects.filter(username = username).first()
        if user:
            # Check if account is locked
            if user.lockout_timestamp and user.lockout_timestamp > timezone.now():
                remaining_time = user.lockout_timestamp - timezone.now()
                return Response({"code": 403, "response": "Please try again later.", "time": remaining_time.total_seconds()})

            # Attempt to authenticate user
            authenticated_user = authenticate(request, username=username, password=password)
            if authenticated_user is not None:
                # Reset failed login attempts on successful login
                user.failed_login_attempts = 0
                user.save()
                login(request, authenticated_user)
                return Response({"code": 200, "response": "Success", "admin": request.user.is_admin})
            else:
                # Increment failed login attempts
                user.failed_login_attempts += 1
                user.save()
                
                # Check if user has exceeded maximum failed login attempts
                if user.failed_login_attempts >= 3:
                    # Lock the account for 5 minutes
                    user.lockout_timestamp = timezone.now() + timezone.timedelta(minutes=5)
                    user.failed_login_attempts = 0  # Reset failed login attempts
                    user.save()
                    remaining_time = user.lockout_timestamp - timezone.now()
                    return Response({"code": 403, "response": "Please try again later.", "time": remaining_time.total_seconds()})
                
                return Response({"code": 401, "response": "Incorrect Password","attempts": user.failed_login_attempts})
        else:
            return Response({"code": 404, "response": "User does not exist"})
    return Response({"code": 200, "response": "Success", "admin": request.user.is_admin})