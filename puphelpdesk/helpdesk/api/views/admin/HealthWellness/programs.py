from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HealthFacilitySerializer
from api.models import HealthFacility

@api_view(['POST'])
def adminAddHealthFacility(request):
    if request.method == "POST":

        health_Facility_Type = request.POST.get('health_Facility_Type')
        health_Facility_Name = request.POST.get('health_Facility_Name')
        health_Facility_Description = request.POST.get('health_Facility_Description')
        health_Facility_Location = request.POST.get('health_Facility_Location')
        health_Facility_Contact = request.POST.get('health_Facility_Contact')

        healthfacility = {
            'health_Facility_Type': health_Facility_Type,
            'health_Facility_Name': health_Facility_Name,
            'health_Facility_Description': health_Facility_Description,
            'health_Facility_Location': health_Facility_Location,
            'health_Facility_Contact': health_Facility_Contact,
        }
        serializer = HealthFacilitySerializer(data=healthfacility)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Health Facility Successfully"})
        return Response({"message": "Add Health Facility Failed"})
    return Response({"message": "Add Health Facility Error"})

@api_view(['GET'])
def adminGetHealthFacility(request):
    if request.method == "GET":
        data = HealthFacility.objects.all()
        serializer = HealthFacilitySerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Health Facility Error"})

@api_view(['GET'])
def adminGetHealthFacilityInfo(request, health_Facility_Id):
    if request.method == "GET":
        healthfacility = HealthFacility.objects.get(pk=health_Facility_Id)
        serializer = HealthFacilitySerializer(healthfacility)
        return Response(serializer.data)
    return Response({"message": "Get Health Facility Info Error"})

@api_view(['PUT'])
def adminEditHealthFacility(request, health_Facility_Id):
    if request.method == "PUT":

        health_Facility_Type = request.POST.get('health_Facility_Type')
        health_Facility_Name = request.POST.get('health_Facility_Name')
        health_Facility_Description = request.POST.get('health_Facility_Description')
        health_Facility_Location = request.POST.get('health_Facility_Location')
        health_Facility_Contact = request.POST.get('health_Facility_Contact')

        healthfacility = HealthFacility.objects.get(pk=health_Facility_Id)
        healthfacility.health_Facility_Type = health_Facility_Type
        healthfacility.health_Facility_Name = health_Facility_Name
        healthfacility.health_Facility_Description = health_Facility_Description
        healthfacility.health_Facility_Location = health_Facility_Location
        healthfacility.health_Facility_Contact = health_Facility_Contact
        healthfacility.save()
        return Response({"message": "Edit Health Facility Success"})
    return Response({"message": "Edit Health Facility Error"})

@api_view(['DELETE'])
def adminDeleteHealthFacility(request, health_Facility_Id):
    if request.method == "DELETE":
        healthfacility = HealthFacility.objects.get(pk=health_Facility_Id)
        healthfacility.delete()
        return Response({"message": "Delete Health Facility Success"})
    return Response({"message": "Delete Health Facility Error"})