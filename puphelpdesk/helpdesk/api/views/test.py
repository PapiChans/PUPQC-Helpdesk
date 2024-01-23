from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import User
from api.serializers import UserSerializer

@api_view(['GET'])
def createUser(request):
   username = '2024-00001-CM-0'
   compare = User.objects.filter(username = username).exists()
   if compare:
      return Response({"message": "User Already Exist"})
   else:
      user = User.objects.create(username = username)
      user.set_password('Student@123')
      user.save()
      return Response({"message": "Add User Successfully"})
   
@api_view(['GET'])
def createAdmin(request):
   username = 'admin1@pup.edu.ph'
   compare = User.objects.filter(username = username).exists()
   if compare:
      return Response({"message": "User Already Exist"})
   else:
      user = User.objects.create(username = username)
      user.set_password('Admin@123')
      user.is_admin = True
      user.save()
      return Response({"message": "Add User Successfully"})
   
@api_view(['GET'])
def testauth(request):
    if request.user.is_authenticated:
         return Response({"message": "Authenticated" ,"Admin": request.user.is_admin, "User": request.user.username, "User ID": request.user.user_Id})
    else:
       return Response({"message": "Not Authenticated"})

@api_view(['GET'])
def getUser(request):
   if request.method == "GET":
      data = User.objects.all()
      serializer = UserSerializer(data, many=True)
      return Response(serializer.data)
   return Response({"message": "Get FAQ Error"})
