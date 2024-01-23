from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FacilitiesSerializer
from api.models import Facilities
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def adminAddFacility(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST" and 'facility_Image' in request.FILES:

            facility_Image = request.FILES['facility_Image']
            facility_Name = request.POST.get('facility_Name')
            facility_Description = request.POST.get('facility_Description')

            facility = {
                'facility_Name': facility_Name,
                'facility_Description': facility_Description,
                'facility_Image': facility_Image
            }

            serializer = FacilitiesSerializer(data=facility)    
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Facility Successfully"})
            return Response({"message": "Add Facility Failed"})
        return Response({"message": "Add Facility Error"})

@api_view(['GET'])
def adminGetFacility(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Facilities.objects.all().order_by('date_Created')
            serializer = FacilitiesSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Facilities Error"})

@api_view(['DELETE'])
def adminDeleteFacility(request, facility_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            
            facility = Facilities.objects.get(pk=facility_Id)
            file = facility.facility_Image.path
            if os.path.exists(file):
                os.remove(file)
            facility.delete()

            return Response({"message": "Delete Facility Success"})
        return Response({"message": "Delete Facility Error"})

@api_view(['GET'])
def adminGetFacilityInfo(request, facility_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            facility = Facilities.objects.get(pk=facility_Id)
            serializer = FacilitiesSerializer(facility)
            return Response(serializer.data)
        return Response({"message": "Get Facility Info Error"})

@api_view(['PUT'])
def adminEditFacility(request, facility_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            facility_Name = request.POST.get('facility_Name')
            facility_Description = request.POST.get('facility_Description')

            facility = Facilities.objects.get(pk=facility_Id)
            facility.facility_Name = facility_Name
            facility.facility_Description = facility_Description
            facility.save()
            return Response({"message": "Edit Facility Success"})
        return Response({"message": "Edit Facility Error"})

@api_view(['PUT'])
def adminReplaceFacilityImage(request, facility_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT" and 'replace_facility_Image' in request.FILES:

            newfacility_Image = request.FILES['replace_facility_Image']
            
            facility = Facilities.objects.get(pk=facility_Id)
            file = facility.facility_Image.path
            if facility.facility_Image is None:
                facility.facility_Image = newfacility_Image
                facility.save()
            if os.path.exists(file):
                os.remove(file)
                facility.facility_Image = newfacility_Image
                facility.save()
            else:
                facility.facility_Image = newfacility_Image
                facility.save()
            return Response({"message": "Replace Facility Image Success"})
        return Response({"message": "Replace Facility Image Error"})