from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from django.contrib.auth import logout

@api_view(['GET'])
def user_logout(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            logout(request)
            return Response({"message": "Success"})
        else:
            return Response({"message": "Error, Logout"})