from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ServiceSerializer
from api.models import Service

@api_view(['GET'])
def studGetService(request):
    if request.method == "GET":
        data = Service.objects.all().order_by('date_Created')
        serializer = ServiceSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Service Error"})
