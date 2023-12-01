from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FinancialAidGuideSerializer
from api.models import FinancialAidGuide
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetFinancial(request):
    if request.method == "GET":
        data = FinancialAidGuide.objects.all().order_by('ResourcesName')
        serializer = FinancialAidGuideSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get File Error"})

@api_view(['GET'])
def ResourcesNameInfo(request, financialAidId):
    if request.method == "GET":
        resources = FinancialAidGuide.objects.get(pk=financialAidId)
        serializer = FinancialAidGuideSerializer(FinancialAidGuide)
        return Response(serializer.data)
    return Response({"message": "Get File Info Error"})
