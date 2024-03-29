from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ParkingRegulationSerializer
from api.models import ParkingRegulation

@api_view(['GET'])
def studGetRegulation(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = ParkingRegulation.objects.all()
            serializer = ParkingRegulationSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Parking Regulation Error"})