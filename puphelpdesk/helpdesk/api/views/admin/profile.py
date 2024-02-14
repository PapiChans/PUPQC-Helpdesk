from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import AdminProfileSerializer
from api.models import AdminProfile

@api_view(['PUT'])
def adminEditProfile(request, profile_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            admin_Last_Name = request.POST.get('admin_Last_Name')
            admin_First_Name = request.POST.get('admin_First_Name')
            admin_Middle_Name = request.POST.get('admin_Middle_Name')
            admin_Contact = request.POST.get('admin_Contact')
            admin_Gender = request.POST.get('admin_Gender')

            profile = AdminProfile.objects.get(pk=profile_Id)
            profile.admin_Last_Name= admin_Last_Name
            profile.admin_First_Name = admin_First_Name
            profile.admin_Middle_Name = admin_Middle_Name if admin_Middle_Name else None
            profile.admin_Contact = admin_Contact
            profile.admin_Gender = admin_Gender
            profile.save()
            return Response({"message": "Edit Profile Success"})
        return Response({"message": "Edit Profile Error"})