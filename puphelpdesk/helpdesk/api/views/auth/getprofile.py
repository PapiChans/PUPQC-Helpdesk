from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import User, UserProfile, AdminProfile
from api.serializers import UserProfileSerializer, AdminProfileSerializer

@api_view(['GET'])
def getUserProfile(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            userprofile = UserProfile.objects.get(user_Id=request.user.user_Id)
            serializer = UserProfileSerializer(userprofile)
            return Response(serializer.data)
        return Response({"message": "Get Profile Error"})
    
@api_view(['GET'])
def getAdminProfile(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            adminprofile = AdminProfile.objects.get(user_Id=request.user.user_Id)
            serializer = AdminProfileSerializer(adminprofile)
            return Response(serializer.data)
        return Response({"message": "Get Profile Error"})