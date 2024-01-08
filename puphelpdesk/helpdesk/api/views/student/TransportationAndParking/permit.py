from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ParkingPermitSerializer
from api.models import ParkingPermit

@api_view(['GET'])
def studGetPermit(request):
    if request.method == "GET":
        data = ParkingPermit.objects.all()
        serializer = ParkingPermitSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Parking Permit Error"})

@api_view(['GET'])
def studGetPermitInfo(request, permit_Id):
    if request.method == "GET":
        parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
        serializer = ParkingPermitSerializer(parkingpermit)
        return Response(serializer.data)
    return Response({"message": "Get Parking Permit Info Error"})

    if request.method == "DELETE":
        parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
        parkingpermit.delete()
        return Response({"message": "Delete Parking Permit Success"})
    return Response({"message": "Delete Parking Permit Error"})