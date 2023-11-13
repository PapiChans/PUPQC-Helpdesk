from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FacilitiesSerializer
from api.models import Facilities
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetFacility(request):
    if request.method == "GET":
        data = Facilities.objects.all().order_by('date_Created')
        serializer = FacilitiesSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Facilities Error"})
