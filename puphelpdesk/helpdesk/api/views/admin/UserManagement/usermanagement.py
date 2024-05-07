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
    
# Define the course code to program mapping
COURSE_CODE_TO_PROGRAM = {
    'BSIT': 'Bachelor of Science in Information Technology',
    'BBTLEDHE': 'Bachelor of Business Technology and Livelihood Education major in Home Economics',
    'BTLEDICT': 'Bachelor of Business Technology and Livelihood Education major in Information Communication and Technology',
    'BSBAHRM': 'Bachelor of Science in Business Administration major in Human Resource Management',
    'BSBA-MM': 'Bachelor of Science in Business Administration major in Marketing Management',
    'BSENTREP': 'Bachelor of Science in Entrepreneurship',
    'BPAPFM': 'Bachelor of Public Administration major in Public Financial Management',
    'DOMTMOM': 'Diploma in Office Management Technology Medical Office Management',
}
    
@api_view(['POST'])
def adminAddStudent(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            username = request.POST['username']
            user_Last_Name = request.POST['user_Last_Name']
            user_First_Name = request.POST['user_First_Name']
            user_Middle_Name = request.POST['user_Middle_Name']
            user_Contact = request.POST['user_Contact']
            course_code = request.POST.get('course_code', '')  # Get course code from request data
            user_Program = COURSE_CODE_TO_PROGRAM.get(course_code, '')  # Get program from mapping
            user_Email = request.POST['user_Email']
            user_Gender = request.POST['user_Gender']

            compare = User.objects.filter(username=username).exists()
            compareemail = UserProfile.objects.filter(user_Email=user_Email).exists()
            if compare:
                return Response({"code": 403, "message": "User Already Exist"})
            if compareemail:
                return Response({"code": 403, "message": "E-Mail Already Exist"})
            else:
                # Create the user instance
                user = User.objects.create(username=username)
                user.set_password('Student@123')
                user.save()

                userprofile_data = {
                    'user_Id': str(user.user_Id),
                    'user_Last_Name': user_Last_Name,
                    'user_First_Name': user_First_Name,
                    'user_Middle_Name': user_Middle_Name if user_Middle_Name else None,
                    'user_Profile': None,
                    'user_Program': user_Program,
                    'user_Email': user_Email,
                    'user_Contact': user_Contact,
                    'user_Gender': user_Gender,
                    'user_Type': 'Student',
                }

                serializer = UserProfileSerializer(data=userprofile_data)
                if serializer.is_valid():
                    serializer.save(user_Id=user)
                    return Response({"code": 200, "message": "Register User Successfully"})
                else:
                    print(serializer.errors)
                    return Response({"message": "Register User Failed"})
        return Response({"message": "Register User Error"})