from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
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