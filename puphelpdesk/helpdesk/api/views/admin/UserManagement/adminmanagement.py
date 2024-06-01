from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import UserSerializer, AdminProfileSerializer
from api.models import User, AdminProfile
from distutils.util import strtobool

@api_view(['GET'])
def adminGetAdminManagement(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            # Fetch AdminProfile objects
            admin_profiles = AdminProfile.objects.all()

            # Create a list to store combined user data
            user_profiles = []

            # Iterate through AdminProfile objects
            for admin_profile in admin_profiles:
                # Serialize AdminProfile data
                admin_profile_data = AdminProfileSerializer(admin_profile).data

                # Add the username from AdminProfile model
                admin_profile_data['username'] = admin_profile.user_Id.username

                # Append the combined data to the list
                user_profiles.append(admin_profile_data)

            # Return the list of combined user data as a JSON response
            return Response(user_profiles)

        return Response({"message": "Get User Profiles Info Error"})
    
@api_view(['POST'])
def adminAddAdmin(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            username = request.POST['username']
            admin_Last_Name = request.POST['admin_Last_Name']
            admin_First_Name = request.POST['admin_First_Name']
            admin_Middle_Name = request.POST['admin_Middle_Name']
            admin_Office = request.POST['admin_Office']
            admin_Contact = request.POST['admin_Contact']
            admin_Email = request.POST['admin_Email']
            admin_Gender = request.POST['admin_Gender']
            isMasterAdmin = request.POST['isMasterAdmin']
            isTechnician = request.POST['isTechnician']

            compare = User.objects.filter(username=username).exists()
            compareemail = AdminProfile.objects.filter(admin_Email=admin_Email).exists()
            if compare:
                return Response({"code": 403, "message": "User Already Exist"})
            if compareemail:
                return Response({"code": 403, "message": "E-Mail Already Exist"})
            else:
                # Create the user instance
                user = User.objects.create(username=username+'@pup.edu.ph')
                user.set_password('Admin@123')
                user.is_admin = True
                user.save()

                userprofile_data = {
                    'user_Id': str(user.user_Id),
                    'admin_Last_Name': admin_Last_Name,
                    'admin_First_Name': admin_First_Name,
                    'admin_Middle_Name': admin_Middle_Name if admin_Middle_Name else None,
                    'admin_Profile': None,
                    'admin_Office': admin_Office,
                    'admin_Email': admin_Email,
                    'admin_Contact': admin_Contact,
                    'admin_Gender': admin_Gender,
                    'is_master_admin': isMasterAdmin,
                    'is_technician': isTechnician
                }

                serializer = AdminProfileSerializer(data=userprofile_data)
                if serializer.is_valid():
                    serializer.save(user_Id=user)
                    return Response({"code": 200, "message": "Register User Successfully"})
                else:
                    print(serializer.errors)
                    return Response({"message": "Register User Failed"})
        return Response({"message": "Register User Error"})
    
@api_view(['GET'])
def adminGetAdminProfile(request, profile_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            try:
                adminprofile = AdminProfile.objects.get(profile_Id=profile_Id)
                admin_profile_data = AdminProfileSerializer(adminprofile).data

                # Include the username from the related User model
                admin_profile_data['username'] = adminprofile.user_Id.username

                return Response(admin_profile_data)
            except AdminProfile.DoesNotExist:
                return Response({"message": "Admin Profile not found"})
        return Response({"message": "Get Profile Error"})

@api_view(['PUT'])
def adminEditAdminProfile(request, profile_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        try:
            profile = AdminProfile.objects.get(pk=profile_Id)
        except AdminProfile.DoesNotExist:
            return Response({"message": "Profile not found"})

        if request.method == "PUT":
            is_technician = request.POST.get('is_technician')

            # Convert string values to boolean
            is_technician = bool(strtobool(is_technician))

            admin_Office = request.POST.get('admin_Office')

            profile.is_technician = is_technician
            profile.admin_Office = admin_Office
            profile.save()

            return Response({"message": "Edit Profile Success"})
        return Response({"message": "Edit Profile Error"})