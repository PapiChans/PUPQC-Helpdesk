from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ResourcesSerializer
from api.models import Resources
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetCampusResources(request):
    if request.method == "GET":
        data = Resources.objects.all()
        serializer = ResourcesSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Resources Error"})