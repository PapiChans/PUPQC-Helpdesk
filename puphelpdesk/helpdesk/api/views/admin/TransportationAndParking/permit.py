from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ParkingPermitSerializer
from api.models import ParkingPermit

@api_view(['POST'])
def adminAddPermit(request):
    if request.method == "POST":

        permit_Title = request.POST.get('permit_Title')
        permit_Info = request.POST.get('permit_Info')
        permit_Guide = request.POST.get('permit_Guide')

        parkingpermit = {
            'permit_Title': permit_Title,
            'permit_Info': permit_Info,
            'permit_Guide': permit_Guide,
        }
        serializer = ParkingPermitSerializer(data=parkingpermit)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Parking Permit Successfully"})
        return Response({"message": "Add Parking Permit Failed"})
    return Response({"message": "Add Parking Permit Error"})

@api_view(['GET'])
def adminGetPermit(request):
    if request.method == "GET":
        data = ParkingPermit.objects.all()
        serializer = ParkingPermitSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Parking Permit Error"})

@api_view(['GET'])
def adminGetPermitInfo(request, permit_Id):
    if request.method == "GET":
        parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
        serializer = ParkingPermitSerializer(parkingpermit)
        return Response(serializer.data)
    return Response({"message": "Get Parking Permit Info Error"})

@api_view(['PUT'])
def adminEditPermit(request, permit_Id):
    if request.method == "PUT":

        permit_Title = request.POST.get('permit_Title')
        permit_Info = request.POST.get('permit_Info')
        permit_Guide = request.POST.get('permit_Guide')

        parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
        parkingpermit.permit_Title = permit_Title
        parkingpermit.permit_Info = permit_Info
        parkingpermit.permit_Guide = permit_Guide
        parkingpermit.save()
        return Response({"message": "Edit Parking Permit Success"})
    return Response({"message": "Edit Parking Permit Error"})

@api_view(['DELETE'])
def adminDeletePermit(request, permit_Id):
    if request.method == "DELETE":
        parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
        parkingpermit.delete()
        return Response({"message": "Delete Parking Permit Success"})
    return Response({"message": "Delete Parking Permit Error"})