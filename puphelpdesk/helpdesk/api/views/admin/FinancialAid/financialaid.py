from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FinancialAndScholarshipGuideSerializer
from api.models import FinancialAndScholarshipGuide

@api_view(['POST'])
def adminAddGuidePost(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            guide_Type = request.POST.get('guide_Type')
            guide_Program = request.POST.get('guide_Program')
            guide_Description = request.POST.get('guide_Description')
            guide_Apply = request.POST.get('guide_Apply')
            guide_To_Submit = request.POST.get('guide_To_Submit')
            guide_Contact = request.POST.get('guide_Contact')
            guide_Deadline_Start = request.POST.get('guide_Deadline_Start')
            guide_Deadline_End = request.POST.get('guide_Deadline_End')
            guide_Remarks = request.POST.get('guide_Remarks')

            FinancialGuide = {
                    'guide_Type': guide_Type,
                    'guide_Program': guide_Program,
                    'guide_Description': guide_Description,
                    'guide_Apply': guide_Apply,
                    'guide_Submit': guide_To_Submit,
                    'guide_Contact': guide_Contact,
                    'guide_Deadline_Start': guide_Deadline_Start,
                    'guide_Deadline_End': guide_Deadline_End,
                    'guide_Remarks': guide_Remarks,
            }
            serializer = FinancialAndScholarshipGuideSerializer(data=FinancialGuide)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Guide Post Successfully"})
            return Response({"message": "Add Guide Post Failed"})
        return Response({"message": "Add Guide Post Error"})

@api_view(['GET'])
def adminGetFinancialAid(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FinancialAndScholarshipGuide.objects.all().filter(guide_Type = 'Financial Aid')
            serializer = FinancialAndScholarshipGuideSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Financial Aid Error"})

@api_view(['GET'])
def adminGetScholarships(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FinancialAndScholarshipGuide.objects.all().filter(guide_Type = 'Scholarship')
            serializer = FinancialAndScholarshipGuideSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Scholarships Error"})

@api_view(['GET'])
def adminGetGuideInfo(request, guide_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            guide = FinancialAndScholarshipGuide.objects.get(pk=guide_Id)
            serializer = FinancialAndScholarshipGuideSerializer(guide)
            return Response(serializer.data)
        return Response({"message": "Get Guide Info Error"})

@api_view(['PUT'])
def adminEditGuidePost(request, guide_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            guide_Type = request.POST.get('guide_Type')
            guide_Program = request.POST.get('guide_Program')
            guide_Description = request.POST.get('guide_Description')
            guide_Apply = request.POST.get('guide_Apply')
            guide_To_Submit = request.POST.get('guide_To_Submit')
            guide_Contact = request.POST.get('guide_Contact')
            guide_Deadline_Start = request.POST.get('guide_Deadline_Start')
            guide_Deadline_End = request.POST.get('guide_Deadline_End')
            guide_Remarks = request.POST.get('guide_Remarks')

            guidePost = FinancialAndScholarshipGuide.objects.get(pk=guide_Id)
            guidePost.guide_Type = guide_Type
            guidePost.guide_Program = guide_Program
            guidePost.guide_Description = guide_Description
            guidePost.guide_Apply = guide_Apply
            guidePost.guide_Submit = guide_To_Submit
            guidePost.guide_Contact = guide_Contact
            guidePost.guide_Deadline_Start = guide_Deadline_Start
            guidePost.guide_Deadline_End =  guide_Deadline_End
            guidePost.guide_Remarks = guide_Remarks
            guidePost.save()
            return Response({"message": "Edit Guide Success"})
        return Response({"message": "Edit Guide Error"})

@api_view(['DELETE'])
def adminDeleteGuidePost(request, guide_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            guidePost = FinancialAndScholarshipGuide.objects.get(pk=guide_Id)
            guidePost.delete()
            return Response({"message": "Delete Guide Success"})
        return Response({"message": "Delete Guide Error"})