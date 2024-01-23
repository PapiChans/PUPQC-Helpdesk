from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ParkingRegulationSerializer
from api.models import ParkingRegulation

@api_view(['POST'])
def adminAddRegulation(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            regulation_Title = request.POST.get('regulation_Title')
            regulation_Info = request.POST.get('regulation_Info')

            parkingregulation = {
                'regulation_Title': regulation_Title,
                'regulation_Info': regulation_Info,
            }
            serializer = ParkingRegulationSerializer(data=parkingregulation)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Parking Regulation Successfully"})
            return Response({"message": "Add Parking Regulation Failed"})
        return Response({"message": "Add Parking Regulation Error"})

@api_view(['GET'])
def adminGetRegulation(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = ParkingRegulation.objects.all()
            serializer = ParkingRegulationSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Parking Regulation Error"})

@api_view(['GET'])
def adminGetRegulationInfo(request, regulation_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            parkingregulation = ParkingRegulation.objects.get(pk=regulation_Id)
            serializer = ParkingRegulationSerializer(parkingregulation)
            return Response(serializer.data)
        return Response({"message": "Get Parking Regulation Info Error"})

@api_view(['PUT'])
def adminEditRegulation(request, regulation_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            regulation_Title = request.POST.get('regulation_Title')
            regulation_Info = request.POST.get('regulation_Info')

            parkingregulation = ParkingRegulation.objects.get(pk=regulation_Id)
            parkingregulation.regulation_Title = regulation_Title
            parkingregulation.regulation_Info = regulation_Info
            parkingregulation.save()
            return Response({"message": "Edit Parking Regulation Success"})
        return Response({"message": "Edit Parking Regulation Error"})

@api_view(['DELETE'])
def adminDeleteRegulation(request, regulation_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            parkingregulation = ParkingRegulation.objects.get(pk=regulation_Id)
            parkingregulation.delete()
            return Response({"message": "Delete Parking Regulation Success"})
        return Response({"message": "Delete Parking Regulation Error"})