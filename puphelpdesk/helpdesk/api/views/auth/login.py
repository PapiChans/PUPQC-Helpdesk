from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
import bcrypt

@api_view(['POST'])
def authlogin(request):
    if request.method == "POST":

        username = request.POST.get('username')
        password = request.POST.get('password')

        login = {
            'username': username,
            'password': password,
        }
        user = get_object_or_404(User, login)
    return Response({})