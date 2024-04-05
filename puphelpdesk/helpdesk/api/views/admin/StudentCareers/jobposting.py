from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import JobPostingSerializer
from api.models import JobPosting
from django.core.files.storage import FileSystemStorage
import os
from django.db.models import Q

@api_view(['POST'])
def adminAddJobPosting(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST" and 'posting_Logo' in request.FILES:

            posting_Logo = request.FILES['posting_Logo']
            posting_Category = request.POST.get('posting_Category')
            posting_Type = request.POST.get('posting_Type')
            posting_Position = request.POST.get('posting_Position')
            posting_Company = request.POST.get('posting_Company')
            posting_Available_Position = request.POST.get('posting_Available_Position')
            posting_Description = request.POST.get('posting_Description')
            posting_Duties = request.POST.get('posting_Duties')
            posting_Qualification = request.POST.get('posting_Qualification')
            posting_Requirements = request.POST.get('posting_Requirements')
            posting_Skills = request.POST.get('posting_Skills')
            posting_Location = request.POST.get('posting_Location')
            posting_Contact = request.POST.get('posting_Contact')

            JobPost= {
                'job_Posting_Type': posting_Type,
                'job_Logo': posting_Logo,
                'job_Posting_Category': posting_Category,
                'job_Posting_Position': posting_Position,
                'job_Posting_Status': 'Active',
                'job_Posting_Company': posting_Company,
                'job_Available_Position': posting_Available_Position,
                'job_Description': posting_Description,
                'job_Duties': posting_Duties,
                'job_Qualifications': posting_Qualification,
                'job_Requirements': posting_Requirements,
                'job_Skills': posting_Skills,
                'job_Location': posting_Location,
                'job_Contact': posting_Contact,
            }

            serializer = JobPostingSerializer(data=JobPost)    
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Job Post Successfully"})
            return Response({"message": "Add Job Post Failed"})
        return Response({"message": "Add Job Post Error"})
    

@api_view(['GET'])
def adminGetJobPosting(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobPosting.objects.all()
            serializer = JobPostingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Job Posts Error"})

@api_view(['GET'])
def adminGetJobCategory(request, job_Posting_Category):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            if job_Posting_Category == "":
                data = JobPosting.objects.all().order_by('date_Created')
            else:
                data = JobPosting.objects.filter(job_Posting_Category=job_Posting_Category).order_by('date_Created')
            serializer = JobPostingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Jobs Error"})


@api_view(['GET'])
def adminGetJobInfo(request, job_Posting_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            jobpost = JobPosting.objects.get(pk=job_Posting_Id)
            serializer = JobPostingSerializer(jobpost)
            return Response(serializer.data)
        return Response({"message": "Get Job Info Error"})

@api_view(['PUT'])
def adminEditJobPosting(request, job_Posting_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            posting_Type = request.POST.get('posting_Type')
            posting_Category = request.POST.get('posting_Category')
            posting_Position = request.POST.get('posting_Position')
            posting_Company = request.POST.get('posting_Company')
            posting_Available_Position = request.POST.get('posting_Available_Position')
            posting_Description = request.POST.get('posting_Description')
            posting_Duties = request.POST.get('posting_Duties')
            posting_Qualification = request.POST.get('posting_Qualification')
            posting_Requirements = request.POST.get('posting_Requirements')
            posting_Skills = request.POST.get('posting_Skills')
            posting_Location = request.POST.get('posting_Location')
            posting_Contact = request.POST.get('posting_Contact')
            posting_Status = request.POST.get('posting_Status')

            JobPost = JobPosting.objects.get(pk=job_Posting_Id)
            JobPost.job_Posting_Type = posting_Type
            JobPost.job_Posting_Category = posting_Category
            JobPost.job_Posting_Position = posting_Position
            JobPost.job_Posting_Status = posting_Status
            JobPost.job_Posting_Company = posting_Company
            JobPost.job_Available_Position = posting_Available_Position
            JobPost.job_Description = posting_Description
            JobPost.job_Duties = posting_Duties
            JobPost.job_Qualifications = posting_Qualification
            JobPost.job_Requirements = posting_Requirements
            JobPost.job_Skills = posting_Skills
            JobPost.job_Location = posting_Location
            JobPost.job_Contact = posting_Contact
            JobPost.save()

            return Response({"message": "Edit Job Post Success"})
        return Response({"message": "Edit Job Post Error"})

@api_view(['PUT'])
def adminReplaceCompanyLogo(request, job_Posting_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT" and 'replace_posting_Logo' in request.FILES:

            newCompany_Logo = request.FILES['replace_posting_Logo']
            
            JobPost = JobPosting.objects.get(pk=job_Posting_Id)
            file = JobPost.job_Logo.path
            if JobPost.job_Logo is None:
                JobPost.job_Logo = newCompany_Logo
                JobPost.save()
            if os.path.exists(file):
                os.remove(file)
                JobPost.job_Logo = newCompany_Logo
                JobPost.save()
            else:
                JobPost.job_Logo = newCompany_Logo
                JobPost.save()
            return Response({"message": "Replace Company Logo Success"})
        return Response({"message": "Replace Company Logo Error"})

@api_view(['DELETE'])
def adminDeleteJobPosting(request, job_Posting_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            
            JobPost = JobPosting.objects.get(pk=job_Posting_Id)
            file = JobPost.job_Logo.path
            if os.path.exists(file):
                os.remove(file)
            JobPost.delete()

            return Response({"message": "Delete Job Post Success"})
        return Response({"message": "Delete Job Post Error"})