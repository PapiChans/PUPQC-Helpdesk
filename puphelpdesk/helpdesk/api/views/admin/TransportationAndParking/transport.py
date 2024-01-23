from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TransportInfoSerializer
from api.models import TransportInfo

@api_view(['POST'])
def adminAddTransport(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            transport_Type = request.POST.get('transport_Type')
            transport_Route = request.POST.get('transport_Route')
            transport_Distance = request.POST.get('transport_Distance')
            transport_Fare = request.POST.get('transport_Fare')
            transport_Info = request.POST.get('transport_Info')
            transport_Time = request.POST.get('transport_Time')
            transport_Schedule = request.POST.get('transport_Schedule')

            transport = {
                'transport_Type': transport_Type,
                'transport_Route': transport_Route,
                'transport_Distance': transport_Distance,
                'transport_Fare': transport_Fare,
                'transport_Info': transport_Info,
                'transport_Time': transport_Time,
                'transport_Schedule': transport_Schedule
            }
            serializer = TransportInfoSerializer(data=transport)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Transport Info Successfully"})
            return Response({"message": "Add Transport Info Failed"})
        return Response({"message": "Add Transport Info Error"})

@api_view(['GET'])
def adminGetTransport(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = TransportInfo.objects.all()
            serializer = TransportInfoSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Transport Info Error"})

@api_view(['GET'])
def adminGetTransportInfo(request, transport_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            transport = TransportInfo.objects.get(pk=transport_Id)
            serializer = TransportInfoSerializer(transport)
            return Response(serializer.data)
        return Response({"message": "Get Transport Info Error"})

@api_view(['PUT'])
def adminEditTransport(request, transport_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            transport_Type = request.POST.get('transport_Type')
            transport_Route = request.POST.get('transport_Route')
            transport_Distance = request.POST.get('transport_Distance')
            transport_Fare = request.POST.get('transport_Fare')
            transport_Info = request.POST.get('transport_Info')
            transport_Time = request.POST.get('transport_Time')
            transport_Schedule = request.POST.get('transport_Schedule')

            transport = TransportInfo.objects.get(pk=transport_Id)
            transport.transport_Type = transport_Type
            transport.transport_Route = transport_Route
            transport.transport_Distance = transport_Distance
            transport.transport_Fare = transport_Fare
            transport.transport_Info = transport_Info
            transport.transport_Time = transport_Time
            transport.transport_Schedule = transport_Schedule
            transport.save()
            return Response({"message": "Edit Transport Info Success"})
        return Response({"message": "Edit Transport Info Error"})

@api_view(['DELETE'])
def adminDeleteTransport(request, transport_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            transport = TransportInfo.objects.get(pk=transport_Id)
            transport.delete()
            return Response({"message": "Delete Transport Info Success"})
        return Response({"message": "Delete Transport Info Error"})