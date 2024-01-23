from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HealthInsuranceSerializer
from api.models import HealthInsurance

@api_view(['GET'])
def studGetHealthInsurance(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = HealthInsurance.objects.all()
            serializer = HealthInsuranceSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Health Insurance Error"})

@api_view(['GET'])
def studGetHealthInsuranceInfo(request, health_Insurance_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            healthinsurance = HealthInsurance.objects.get(pk=health_Insurance_Id)
            serializer = HealthInsuranceSerializer(healthinsurance)
            return Response(serializer.data)
        return Response({"message": "Get Health Insurance Info Error"})