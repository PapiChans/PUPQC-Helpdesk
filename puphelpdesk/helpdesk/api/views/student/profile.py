from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import UserProfileSerializer
from api.models import UserProfile

@api_view(['PUT'])
def studEditProfile(request, profile_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            user_Program = request.POST.get('user_Program')
            user_Last_Name = request.POST.get('user_Last_Name')
            user_First_Name = request.POST.get('user_First_Name')
            user_Middle_Name = request.POST.get('user_Middle_Name')
            user_Contact = request.POST.get('user_Contact')
            user_Gender = request.POST.get('user_Gender')

            profile = UserProfile.objects.get(pk=profile_Id)
            profile.user_Program = user_Program
            profile.user_Last_Name = user_Last_Name
            profile.user_First_Name = user_First_Name
            profile.user_Middle_Name = user_Middle_Name if user_Middle_Name else None
            profile.user_Contact = user_Contact
            profile.user_Gender = user_Gender
            profile.save()

            return Response({"message": "Edit Profile Success"})
        return Response({"message": "Edit Profile Error"})