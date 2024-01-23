from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ResourcesSerializer
from api.models import Resources
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def adminAddCampusResources(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST" and 'resources_File' in request.FILES:

            resources_File = request.FILES['resources_File']
            resources_Name = request.POST.get('resources_Name')

            resources = {
                'resources_Name': resources_Name,
                'resources_File': resources_File
            }

            serializer = ResourcesSerializer(data=resources)    
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Resources Successfully"})
            return Response({"message": "Add Resources Failed"})
        return Response({"message": "Add Resources Error"})

@api_view(['GET'])
def adminGetCampusResources(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Resources.objects.all()
            serializer = ResourcesSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Resources Error"})

@api_view(['DELETE'])
def adminDeleteCampusResources(request, resources_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            
            resources = Resources.objects.get(pk=resources_Id)
            file = resources.resources_File.path
            if os.path.exists(file):
                os.remove(file)
            resources.delete()

            return Response({"message": "Delete Resources Success"})
        return Response({"message": "Delete Resources Error"})