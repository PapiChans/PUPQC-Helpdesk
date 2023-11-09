from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import SuccessResourcesSerializer
from api.models import SuccessResources
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def adminAddSuccessResources(request):
    if request.method == "POST" and 'success_resources_File' in request.FILES:

        success_resources_File = request.FILES['success_resources_File']
        success_resources_Name = request.POST.get('success_resources_Name')

        success_resources = {
            'success_resources_Name': success_resources_Name,
            'success_resources_File': success_resources_File
        }

        serializer = SuccessResourcesSerializer(data=success_resources)    
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Resources Successfully"})
        return Response({"message": "Add Resources Failed"})
    return Response({"message": "Add Resources Error"})

@api_view(['GET'])
def adminGetSuccessResources(request):
    if request.method == "GET":
        data = SuccessResources.objects.all()
        serializer = SuccessResourcesSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Resources Error"})

@api_view(['DELETE'])
def adminDeleteSuccessResources(request, success_resources_Id):
    if request.method == "DELETE":
        
        success_resources = SuccessResources.objects.get(pk=success_resources_Id)
        file = success_resources.success_resources_File.path
        if os.path.exists(file):
            os.remove(file)
        success_resources.delete()

        return Response({"message": "Delete Resources Success"})
    return Response({"message": "Delete Resources Error"})