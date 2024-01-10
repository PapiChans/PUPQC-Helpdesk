from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TransportInfoSerializer
from api.models import TransportInfo

@api_view(['GET'])
def studGetTransport(request):
    if request.method == "GET":
        data = TransportInfo.objects.all()
        serializer = TransportInfoSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Transport Info Error"})

@api_view(['GET'])
def studGetTransportInfo(request, transport_Id):
    if request.method == "GET":
        transport = TransportInfo.objects.get(pk=transport_Id)
        serializer = TransportInfoSerializer(transport)
        return Response(serializer.data)
    return Response({"message": "Get Transport Info Error"})