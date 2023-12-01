from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ScholarshipOpportunitiesSerializer
from api.models import ScholarshipOpportunities
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetOpportunities(request):
    if request.method == "GET":
        data = ScholarshipOpportunities.objects.all().order_by('ScholarshipName')
        serializer = ScholarshipOpportunitiesSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Scholarship Error"})

@api_view(['GET'])
def ScholarshipInfo(request,  ScholarshipId):
    if request.method == "GET":
        scholarship = ScholarshipOpportunities.objects.get(pk=ScholarshipId)
        serializer = ScholarshipOpportunitiesSerializer(ScholarshipOpportunities)
        return Response(serializer.data)
    return Response({"message": "Get Item Info Error"})
