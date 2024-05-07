from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, UserProfileSerializer
from api.models import User, UserProfile


@api_view(['GET'])
def adminGetUserManagement(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            # Fetch UserProfile objects excluding 'External Client'
            data = UserProfile.objects.exclude(user_Type='External Client')

            # Create a list to store user data
            user_profiles = []

            # Iterate through UserProfile objects
            for profile in data:
                # Fetch the corresponding User object
                user = profile.user_Id

                # Create a dictionary to store user data
                user_data = {
                    "user_Last_Name": profile.user_Last_Name,
                    "user_First_Name": profile.user_First_Name,
                    "user_Middle_Name": profile.user_Middle_Name,
                    "user_Profile": profile.user_Profile.url if profile.user_Profile else None,
                    "user_Program": profile.user_Program,
                    "user_Email": profile.user_Email,
                    "user_Contact": profile.user_Contact,
                    "user_Gender": profile.user_Gender,
                    "user_Type": profile.user_Type,
                    "date_Created": profile.date_Created,
                    "username": user.username  # Include username from User model
                }

                # Append user data to the list
                user_profiles.append(user_data)

            # Return the list of user data as a JSON response
            return Response(user_profiles)

        return Response({"message": "Get User Profiles Info Error"})