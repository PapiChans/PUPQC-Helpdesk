from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from django.contrib.auth import logout

@api_view(['GET'])
def checkSession(request):
    if request.method == "GET":
        session_expired = False
        if not request.user.is_authenticated:
            session_expired = True
        return Response({"session_expired": session_expired})