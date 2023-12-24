from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import IDandCardSerializer
from api.models import IDandCard

@api_view(['POST'])
def adminAddObtainingStep(request):
    if request.method == "POST":

        guide_Step_Number = request.POST.get('guide_Step_Number')
        guide_Title = request.POST.get('guide_Title')
        guide_Text = request.POST.get('guide_Text')

        guide = {
            'guide_Type': 'Obtaining ID',
            'guide_Step_Number': guide_Step_Number,
            'guide_Title': guide_Title,
            'guide_Text': guide_Text,
        }
        serializer = IDandCardSerializer(data=guide)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Guide Step Successfully"})
        return Response({"message": "Add Guide Step Failed"})
    return Response({"message": "Add Guide Step Error"})

@api_view(['POST'])
def adminAddReplacingStep(request):
    if request.method == "POST":

        guide_Step_Number = request.POST.get('guide_Step_Number')
        guide_Title = request.POST.get('guide_Title')
        guide_Text = request.POST.get('guide_Text')

        guide = {
            'guide_Type': 'Replacing ID',
            'guide_Step_Number': guide_Step_Number,
            'guide_Title': guide_Title,
            'guide_Text': guide_Text,
        }
        serializer = IDandCardSerializer(data=guide)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Guide Step Successfully"})
        return Response({"message": "Add Guide Step Failed"})
    return Response({"message": "Add Guide Step Error"})

@api_view(['POST'])
def adminAddAccessCardStep(request):
    if request.method == "POST":

        guide_Step_Number = request.POST.get('guide_Step_Number')
        guide_Title = request.POST.get('guide_Title')
        guide_Text = request.POST.get('guide_Text')

        guide = {
            'guide_Type': 'Access Card',
            'guide_Step_Number': guide_Step_Number,
            'guide_Title': guide_Title,
            'guide_Text': guide_Text,
        }
        serializer = IDandCardSerializer(data=guide)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Guide Step Successfully"})
        return Response({"message": "Add Guide Step Failed"})
    return Response({"message": "Add Guide Step Error"})

@api_view(['GET'])
def adminGetObtainingStep(request):
    if request.method == "GET":
        data = IDandCard.objects.all().filter(guide_Type = 'Obtaining ID').order_by('guide_Step_Number')
        serializer = IDandCardSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Guide Error"})

@api_view(['GET'])
def adminGetReplacingStep(request):
    if request.method == "GET":
        data = IDandCard.objects.all().filter(guide_Type = 'Replacing ID').order_by('guide_Step_Number')
        serializer = IDandCardSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Guide Error"})

@api_view(['GET'])
def adminGetAccessCardStep(request):
    if request.method == "GET":
        data = IDandCard.objects.all().filter(guide_Type = 'Access Card').order_by('guide_Step_Number')
        serializer = IDandCardSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Guide Error"})

@api_view(['GET'])
def adminGetStepInfo(request, guide_Id):
    if request.method == "GET":
        info = IDandCard.objects.get(pk=guide_Id)
        serializer = IDandCardSerializer(info)
        return Response(serializer.data)
    return Response({"message": "Get Step Info Error"})

@api_view(['PUT'])
def adminEditGuide(request, guide_Id):
    if request.method == "PUT":

        guide_Step_Number = request.POST.get('guide_Step_Number')
        guide_Title = request.POST.get('guide_Title')
        guide_Text = request.POST.get('guide_Text')

        guide = IDandCard.objects.get(pk=guide_Id)
        guide.guide_Step_Number = guide_Step_Number
        guide.guide_Title = guide_Title
        guide.guide_Text = guide_Text
        guide.save()
        return Response({"message": "Edit Guide Success"})
    return Response({"message": "Edit Guide Error"})

@api_view(['DELETE'])
def adminDeleteGuide(request, guide_Id):
    if request.method == "DELETE":
        guide = IDandCard.objects.get(pk=guide_Id)
        guide.delete()
        return Response({"message": "Delete Guide Success"})
    return Response({"message": "Delete Guide Error"})