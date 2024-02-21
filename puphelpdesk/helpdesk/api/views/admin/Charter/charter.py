from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import CharterSerializer, CharterStepsSerializer
from api.models import Charter, CharterSteps

# For Searching Query
from django.db.models import Q

@api_view(['POST'])
def adminAddCharter(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            charter_Number = request.POST.get('charter_Number')
            charter_Category = request.POST.get('charter_Category')
            charter_Title = request.POST.get('charter_Title')
            charter_Description = request.POST.get('charter_Description')
            charter_Office = request.POST.get('charter_Office')
            charter_Classification = request.POST.get('charter_Classification')
            charter_Transaction = request.POST.get('charter_Transaction')
            charter_Avail = request.POST.get('charter_Avail')
            charter_Requirements = request.POST.get('charter_Requirements')
            charter_Secure = request.POST.get('charter_Secure')

            charter = {
                'charter_Number': charter_Number,
                'charter_Category': charter_Category,
                'charter_Title': charter_Title,
                'charter_Description': charter_Description,
                'charter_Office': charter_Office,
                'charter_Classification': charter_Classification,
                'charter_Transaction': charter_Transaction,
                'charter_Avail': charter_Avail,
                'charter_Requirements': charter_Requirements,
                'charter_Secure': charter_Secure,
            }
            serializer = CharterSerializer(data=charter)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Charter Successfully"})
            return Response({"message": "Add Charter Failed"})
        return Response({"message": "Add Charter Error"})

@api_view(['GET'])
def adminGetCharter(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Charter.objects.all()
            serializer = CharterSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Error"})
    
@api_view(['GET'])
def adminGetCharterCategory(request, charter_Category):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Charter.objects.all().filter(charter_Category=charter_Category).order_by('date_Created')
            serializer = CharterSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Error"})

@api_view(['GET'])
def adminGetCharterInfo(request, charter_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = Charter.objects.get(pk=charter_Id)
            serializer = CharterSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Info Error"})

@api_view(['GET'])
def adminGetCharterNumberInfo(request, charter_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = Charter.objects.get(charter_Number=charter_Number)
            serializer = CharterSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Info Error"})

@api_view(['PUT'])
def adminEditCharter(request, charter_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            charter_Category = request.POST.get('charter_Category')
            charter_Title = request.POST.get('charter_Title')
            charter_Description = request.POST.get('charter_Description')
            charter_Office = request.POST.get('charter_Office')
            charter_Classification = request.POST.get('charter_Classification')
            charter_Transaction = request.POST.get('charter_Transaction')
            charter_Avail = request.POST.get('charter_Avail')
            charter_Requirements = request.POST.get('charter_Requirements')
            charter_Secure = request.POST.get('charter_Secure')

            charter = Charter.objects.get(pk=charter_Id)
            charter.charter_Category = charter_Category
            charter.charter_Title = charter_Title
            charter.charter_Description = charter_Description
            charter.charter_Office = charter_Office
            charter.charter_Classification = charter_Classification
            charter.charter_Transaction = charter_Transaction
            charter.charter_Avail = charter_Avail
            charter.charter_Requirements = charter_Requirements
            charter.charter_Secure = charter_Secure
            charter.save()
            return Response({"message": "Edit Charter Success"})
        return Response({"message": "Edit Charter Error"})

@api_view(['DELETE'])
def adminDeleteCharter(request, charter_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            charter = Charter.objects.get(pk=charter_Id)
            checkstep = CharterSteps.objects.all().filter(charter_Id=charter_Id).exists()
            if checkstep:
                return Response({"message": "Step Exist"})
            else:
                charter.delete()
                return Response({"message": "Delete Charter Success"})
        return Response({"message": "Delete Charter Error"})
    
## Charter Step Section

@api_view(['POST'])
def adminAddCharterStep(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            charter_Id = request.POST.get('charter_Id')
            step_Client = request.POST.get('step_Client')
            step_Agency = request.POST.get('step_Agency')
            step_Fees = request.POST.get('step_Fees')
            step_Time = request.POST.get('step_Time')
            step_Person = request.POST.get('step_Person')

            charter = {
                'charter_Id': charter_Id,
                'step_Client': step_Client,
                'step_Agency': step_Agency,
                'step_Fees': step_Fees,
                'step_Time': step_Time,
                'step_Person': step_Person,
            }
            serializer = CharterStepsSerializer(data=charter)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Charter Step Successfully"})
            return Response({"message": "Add Charter Step Failed"})
        return Response({"message": "Add Charter Step Error"})
    
@api_view(['GET'])
def adminGetCharterStep(request, charter_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = CharterSteps.objects.all().filter(charter_Id=charter_Id).order_by('date_Created')
            serializer = CharterStepsSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Step Error"})

@api_view(['GET'])
def adminGetCharterStepInfo(request, step_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = CharterSteps.objects.get(pk=step_Id)
            serializer = CharterStepsSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Step Info Error"})

@api_view(['PUT'])
def adminEditCharterStep(request, step_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            step_Client = request.POST.get('step_Client')
            step_Agency = request.POST.get('step_Agency')
            step_Fees = request.POST.get('step_Fees')
            step_Time = request.POST.get('step_Time')
            step_Person = request.POST.get('step_Person')

            charter = CharterSteps.objects.get(pk=step_Id)
            charter.step_Client = step_Client
            charter.step_Agency = step_Agency
            charter.step_Fees = step_Fees
            charter.step_Time = step_Time
            charter.step_Person = step_Person
            charter.save()
            return Response({"message": "Edit Charter Success"})
        return Response({"message": "Edit Charter Error"})
    
@api_view(['DELETE'])
def adminDeleteCharterStep(request, step_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            charter = CharterSteps.objects.get(pk=step_Id)
            charter.delete()
            return Response({"message": "Delete Charter Step Success"})
        return Response({"message": "Delete Charter Step Error"})
    
@api_view(['POST'])
def adminSearchCharter(request, charter_Keyword):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            charter_Keyword = request.POST.get('charter_Keyword')
            data = Charter.objects.filter(
                Q(charter_Avail__icontains=charter_Keyword) |
                Q(charter_Classification__icontains=charter_Keyword) |
                Q(charter_Description__icontains=charter_Keyword) |
                Q(charter_Office__icontains=charter_Keyword) |
                Q(charter_Requirements__icontains=charter_Keyword) |
                Q(charter_Secure__icontains=charter_Keyword) |
                Q(charter_Title__icontains=charter_Keyword) |
                Q(charter_Transaction__icontains=charter_Keyword)
            ).order_by('date_Created')
            serializer = CharterSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Error"})