from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LivingAssistanceSerializer
from api.models import LivingAssistance

@api_view(['GET'])
def studGetLivingAssistance(request):
    if request.method == "GET":
        data = LivingAssistance.objects.all()
        serializer = LivingAssistanceSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Living Assistance Error"})