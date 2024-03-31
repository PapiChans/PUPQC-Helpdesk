from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import JobPostingSerializer
from api.models import JobPosting
from django.core.files.storage import FileSystemStorage
import os
from django.db.models import Q

@api_view(['GET'])
def studGetJobPosting(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobPosting.objects.all()
            serializer = JobPostingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Job Posts Error"})
    
@api_view(['GET'])
def studGetJobCategory(request, job_Posting_Category):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobPosting.objects.all().filter(job_Posting_Category=job_Posting_Category).order_by('date_Created')
            serializer = JobPostingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Jobs Error"})
    

@api_view(['GET'])
def studGetJobInfo(request, job_Posting_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            jobpost = JobPosting.objects.get(pk=job_Posting_Id)
            serializer = JobPostingSerializer(jobpost)
            return Response(serializer.data)
        return Response({"message": "Get Job Info Error"})
