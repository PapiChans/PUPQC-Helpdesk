from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import SuccessResourcesSerializer
from api.models import SuccessResources
from django.core.files.storage import FileSystemStorage
import os


@api_view(['GET'])
def studGetSuccessResources(request):
    if request.method == "GET":
        data = SuccessResources.objects.all()
        serializer = SuccessResourcesSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Resources Error"})
