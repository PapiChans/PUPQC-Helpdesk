from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HousingOptionsSerializer
from api.models import HousingOptions
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetHousingReferrals(request):
    if request.method == "GET":
        data = HousingOptions.objects.all()
        serializer = HousingOptionsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Housing Error"})

@api_view(['GET'])
def studGetHousingReferralsInfo(request, housing_Id):
    if request.method == "GET":
        housing = HousingOptions.objects.get(pk=housing_Id)
        serializer = HousingOptionsSerializer(housing)
        return Response(serializer.data)
    return Response({"message": "Get Housing Info Error"})