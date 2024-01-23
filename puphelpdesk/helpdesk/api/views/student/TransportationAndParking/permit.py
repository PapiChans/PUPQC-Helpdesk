from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ParkingPermitSerializer
from api.models import ParkingPermit

@api_view(['GET'])
def studGetPermit(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = ParkingPermit.objects.all()
            serializer = ParkingPermitSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Parking Permit Error"})

@api_view(['GET'])
def studGetPermitInfo(request, permit_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            parkingpermit = ParkingPermit.objects.get(pk=permit_Id)
            serializer = ParkingPermitSerializer(parkingpermit)
            return Response(serializer.data)
        return Response({"message": "Get Parking Permit Info Error"})