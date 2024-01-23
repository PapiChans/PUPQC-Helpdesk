from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import JobSearchSerializer
from api.models import JobSearch

@api_view(['POST'])
def adminAddJobSearch(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            job_Search_Title = request.POST.get('job_Search_Title')
            job_Search_Type = request.POST.get('job_Search_Type')
            job_Search_Description = request.POST.get('job_Search_Description')
            job_Search_Link  = request.POST.get('job_Search_Link')

            jobsearch = {
                'job_Search_Title': job_Search_Title,
                'job_Search_Type': job_Search_Type,
                'job_Search_Description': job_Search_Description,
                'job_Search_Link': job_Search_Link,
            }
            serializer = JobSearchSerializer(data=jobsearch)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Job Search Successfully"})
            return Response({"message": "Add Job Search Failed"})
        return Response({"message": "Add Job Search Error"})

@api_view(['GET'])
def adminGetJobSearch(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobSearch.objects.all()
            serializer = JobSearchSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Job Search Error"})

@api_view(['GET'])
def adminGetJobSearchInfo(request, job_Search_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            jobsearch = JobSearch.objects.get(pk=job_Search_Id)
            serializer = JobSearchSerializer(jobsearch)
            return Response(serializer.data)
        return Response({"message": "Get Job Search Info Error"})

@api_view(['PUT'])
def adminEditJobSearch(request, job_Search_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            job_Search_Title = request.POST.get('job_Search_Title')
            job_Search_Type = request.POST.get('job_Search_Type')
            job_Search_Description = request.POST.get('job_Search_Description')
            job_Search_Link  = request.POST.get('job_Search_Link')

            jobsearch = JobSearch.objects.get(pk=job_Search_Id)
            jobsearch.job_Search_Title = job_Search_Title
            jobsearch.job_Search_Type = job_Search_Type
            jobsearch.job_Search_Description = job_Search_Description
            jobsearch.job_Search_Link = job_Search_Link
            jobsearch.save()
            return Response({"message": "Edit Job Search Success"})
        return Response({"message": "Edit Job Search Error"})

@api_view(['DELETE'])
def adminDeleteJobSearch(request, job_Search_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            jobsearch = JobSearch.objects.get(pk=job_Search_Id)
            jobsearch.delete()
            return Response({"message": "Delete Job Search Success"})
        return Response({"message": "Delete Job Search Error"})