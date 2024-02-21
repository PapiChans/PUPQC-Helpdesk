from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import CharterSerializer, CharterStepsSerializer
from api.models import Charter, CharterSteps

# For Search Query
from django.db.models import Q

@api_view(['GET'])
def studGetCharter(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Charter.objects.all()
            serializer = CharterSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Error"})
    
@api_view(['GET'])
def studGetCharterCategory(request, charter_Category):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Charter.objects.all().filter(charter_Category=charter_Category).order_by('date_Created')
            serializer = CharterSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Error"})

@api_view(['GET'])
def studGetCharterInfo(request, charter_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = Charter.objects.get(pk=charter_Id)
            serializer = CharterSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Info Error"})

@api_view(['GET'])
def studGetCharterNumberInfo(request, charter_Number):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = Charter.objects.get(charter_Number=charter_Number)
            serializer = CharterSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Info Error"})

## Charter Step Section
    
@api_view(['GET'])
def studGetCharterStep(request, charter_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = CharterSteps.objects.all().filter(charter_Id=charter_Id).order_by('date_Created')
            serializer = CharterStepsSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Charter Step Error"})

@api_view(['GET'])
def studGetCharterStepInfo(request, step_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            charter = CharterSteps.objects.get(pk=step_Id)
            serializer = CharterStepsSerializer(charter)
            return Response(serializer.data)
        return Response({"message": "Get Charter Step Info Error"})
    
@api_view(['POST'])
def studSearchCharter(request, charter_Keyword):
    if request.user.is_anonymous or request.user.is_admin:
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