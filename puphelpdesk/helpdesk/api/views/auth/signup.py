from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import User, UserProfile
from api.serializers import UserSerializer, UserProfileSerializer
from django.shortcuts import get_object_or_404

@api_view(['POST'])
def signup(request):
    if not request.user.is_anonymous:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            username = request.POST['username']
            password = request.POST['password']
            user_Last_Name = request.POST['user_Last_Name']
            user_First_Name = request.POST['user_First_Name']
            user_Middle_Name = request.POST['user_Middle_Name']
            user_Contact = request.POST['user_Contact']
            user_Email = request.POST['user_Email']
            user_Gender = request.POST['user_Gender']

            compare = User.objects.filter(username=username).exists()
            compareemail = UserProfile.objects.filter(user_Email=user_Email).exists()
            if compare:
                return Response({"message": "User Already Exist"})
            if compareemail:
                return Response({"message": "E-Mail Already Exist"})
            else:
                # Create the user instance
                user = User.objects.create(username=username)
                user.set_password(password)
                user.save()

                userprofile_data = {
                    'user_Id': str(user.user_Id),
                    'user_Last_Name': user_Last_Name,
                    'user_First_Name': user_First_Name,
                    'user_Middle_Name': user_Middle_Name if user_Middle_Name else None,
                    'user_Profile': None,
                    'user_Program': 'External Client',
                    'user_Email': user_Email,
                    'user_Contact': user_Contact,
                    'user_Gender': user_Gender,
                    'user_Type': 'External Client',
                }

                serializer = UserProfileSerializer(data=userprofile_data)
                if serializer.is_valid():
                    serializer.save(user_Id=user)
                    return Response({"message": "Register User Successfully"})
                else:
                    print(serializer.errors)
                    return Response({"message": "Register User Failed"})
        return Response({"message": "Register User Error"})