from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HealthFacilitySerializer
from api.models import HealthFacility

@api_view(['GET'])
def studGetHealthFacility(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = HealthFacility.objects.all()
            serializer = HealthFacilitySerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Health Facility Error"})

@api_view(['GET'])
def studGetHealthFacilityInfo(request, health_Facility_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            healthfacility = HealthFacility.objects.get(pk=health_Facility_Id)
            serializer = HealthFacilitySerializer(healthfacility)
            return Response(serializer.data)
        return Response({"message": "Get Health Facility Info Error"})