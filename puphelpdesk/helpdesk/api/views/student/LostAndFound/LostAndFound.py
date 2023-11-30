from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LostSerializer
from api.models import Lost
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetEvent(request):
    if request.method == "GET":
        data = Lost.objects.all().order_by('item_Name')
        serializer = LostSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Item Error"})

@api_view(['GET'])
def LostInfo(request, lostItem_Id):
    if request.method == "GET":
        lost = Lost.objects.get(pk=lostItem_Id)
        serializer = LostSerializer(lost)
        return Response(serializer.data)
    return Response({"message": "Get Item Info Error"})
