from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ServiceSerializer
from api.models import Service

@api_view(['POST'])
def adminAddService(request):
    if request.method == "POST":

        service_Name = request.POST.get('service_Name')
        service_Description = request.POST.get('service_Description')

        service = {
                'service_Name': service_Name,
                'service_Description': service_Description,
        }
        serializer = ServiceSerializer(data=service)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Service Successfully"})
        return Response({"message": "Add Service Failed"})
    return Response({"message": "Add Service Error"})

@api_view(['GET'])
def adminGetService(request):
    if request.method == "GET":
        data = Service.objects.all().order_by('date_Created')
        serializer = ServiceSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Service Error"})


@api_view(['GET'])
def adminGetServiceInfo(request, service_Id):
    if request.method == "GET":
        service = Service.objects.get(pk=service_Id)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
    return Response({"message": "Get Service Info Error"})

@api_view(['PUT'])
def adminEditService(request, service_Id):
    if request.method == "PUT":

        service_Name = request.POST.get('service_Name')
        service_Description = request.POST.get('service_Description')

        service = Service.objects.get(pk=service_Id)
        service.service_Name = service_Name
        service.service_Description = service_Description
        service.save()
        return Response({"message": "Edit Service Success"})
    return Response({"message": "Edit Service Error"})

@api_view(['DELETE'])
def adminDeleteService(request, service_Id):
    if request.method == "DELETE":
        service = Service.objects.get(pk=service_Id)
        service.delete()
        return Response({"message": "Delete Service Success"})
    return Response({"message": "Delete Service Error"})