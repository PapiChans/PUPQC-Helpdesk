from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer
from api.models import User
from django.contrib.auth import authenticate, login
from django.shortcuts import render
import bcrypt

salt = bcrypt.gensalt()

@api_view(['POST'])
def login(request):
   return Response({})


@api_view(['GET'])
def getUser(request):
   data = User.objects.all()
   serializer = UserSerializer(data, many=True)
   lname = 'Altiche'
   fname = 'Christian'
   mname = 'Alcovendas'
   full_name = lname + " " + fname
   if mname:
      full_name += " " + mname[0] + "."
   print(full_name)
   return Response(serializer.data)

@api_view(['POST'])
def userlogin(request):
   if request.method == "POST":
      username = request.POST.get('username')
      password = request.POST.get('password')
      user = authenticate(request, user_Username=username, user_Password=password)
      print(user)
      if user is not None:
         if bcrypt.checkpw(hash, password):
            print('Password Match')
            login(request, user)
            return render('student/dashboard')
         else:
            print("Wrong Password")
      else:
         return render(request, 'LandingPage/index.html')


@api_view(['POST'])
def createUser(request):
   if request.method == "POST":
      username = request.POST.get('username')
      password = request.POST.get('password')
      hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
      user = {
            'user_Username': username,
            'user_Password': hash,
      }
      serializer = UserSerializer(data=user)
      if serializer.is_valid():
         serializer.save()
   return Response(serializer.user, status=status.HTTP_404_NOT_FOUND)
