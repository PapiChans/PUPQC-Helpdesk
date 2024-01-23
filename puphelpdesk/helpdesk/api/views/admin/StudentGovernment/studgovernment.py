from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import StudentGovernmentSerializer
from api.models import StudentGovernment

@api_view(['POST'])
def adminAddGovernment(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            government_Type = request.POST.get('government_Type')
            government_Title = request.POST.get('government_Title')
            government_Name = request.POST.get('government_Name')
            government_Role = request.POST.get('government_Role')
            government_Description = request.POST.get('government_Description')
            government_Qualification = request.POST.get('government_Qualification')
            government_Participation = request.POST.get('government_Participation')

            government = {
                'government_Type': government_Type,
                'government_Title': government_Title,
                'government_Name': government_Name,
                'government_Role': government_Role,
                'government_Description': government_Description,
                'government_Qualification': government_Qualification,
                'government_Participation': government_Participation,
            }
            serializer = StudentGovernmentSerializer(data=government)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Student Government Successfully"})
            return Response({"message": "Add Student Government Failed"})
        return Response({"message": "Add Student Government Error"})

@api_view(['GET'])
def adminGetGovernment(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = StudentGovernment.objects.all()
            serializer = StudentGovernmentSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Student Government Error"})

@api_view(['GET'])
def adminGetGovernmentInfo(request, government_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            government = StudentGovernment.objects.get(pk=government_Id)
            serializer = StudentGovernmentSerializer(government)
            return Response(serializer.data)
        return Response({"message": "Get Student Government Info Error"})

@api_view(['PUT'])
def adminEditGovernment(request, government_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            government_Type = request.POST.get('government_Type')
            government_Title = request.POST.get('government_Title')
            government_Name = request.POST.get('government_Name')
            government_Role = request.POST.get('government_Role')
            government_Description = request.POST.get('government_Description')
            government_Qualification = request.POST.get('government_Qualification')
            government_Participation = request.POST.get('government_Participation')

            government = StudentGovernment.objects.get(pk=government_Id)
            government.government_Type = government_Type
            government.government_Title = government_Title
            government.government_Name = government_Name
            government.government_Role = government_Role
            government.government_Description = government_Description
            government.government_Qualification = government_Qualification
            government.government_Participation = government_Participation
            government.save()
            return Response({"message": "Edit Student Government Success"})
        return Response({"message": "Edit Student Government Error"})

@api_view(['DELETE'])
def adminDeleteGovernment(request, government_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            government = StudentGovernment.objects.get(pk=government_Id)
            government.delete()
            return Response({"message": "Delete Student Government Success"})
        return Response({"message": "Delete Student Government Error"})