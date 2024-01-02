from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LivingAssistanceSerializer
from api.models import LivingAssistance

@api_view(['POST'])
def adminAddLivingAssistance(request):
    if request.method == "POST":

        assistance_Type = request.POST.get('assistance_Type')
        assistance_Name = request.POST.get('assistance_Name')
        assistance_Description = request.POST.get('assistance_Description')
        assistance_Link  = request.POST.get('assistance_Link')

        LivingAssistance = {
            'assistance_Type': assistance_Type,
            'assistance_Name': assistance_Name,
            'assistance_Description': assistance_Description,
            'assistance_Link': assistance_Link,
        }
        serializer = LivingAssistanceSerializer(data=LivingAssistance)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Living Assistance Successfully"})
        return Response({"message": "Add Living Assistance Failed"})
    return Response({"message": "Add Living Assistance Error"})

@api_view(['GET'])
def adminGetLivingAssistance(request):
    if request.method == "GET":
        data = LivingAssistance.objects.all()
        serializer = LivingAssistanceSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Living Assistance Error"})

@api_view(['GET'])
def adminGetLivingAssistanceInfo(request, assistance_Id):
    if request.method == "GET":
        assistance = LivingAssistance.objects.get(pk=assistance_Id)
        serializer = LivingAssistanceSerializer(assistance)
        return Response(serializer.data)
    return Response({"message": "Get Living Assistance Info Error"})

@api_view(['PUT'])
def adminEditLivingAssistance(request, assistance_Id):
    if request.method == "PUT":

        assistance_Type = request.POST.get('assistance_Type')
        assistance_Name = request.POST.get('assistance_Name')
        assistance_Description = request.POST.get('assistance_Description')
        assistance_Link  = request.POST.get('assistance_Link')

        assistance = LivingAssistance.objects.get(pk=assistance_Id)
        assistance.assistance_Type = assistance_Type
        assistance.assistance_Name = assistance_Name
        assistance.assistance_Description = assistance_Description
        assistance.assistance_Link = assistance_Link
        assistance.save()
        return Response({"message": "Edit Living Assistance Success"})
    return Response({"message": "Edit Living Assistance Error"})

@api_view(['DELETE'])
def adminDeleteLivingAssistance(request, assistance_Id):
    if request.method == "DELETE":
        assistance = LivingAssistance.objects.get(pk=assistance_Id)
        assistance.delete()
        return Response({"message": "Delete Living Assistance Success"})
    return Response({"message": "Delete Living Assistance Error"})