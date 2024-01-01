from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HealthInsuranceSerializer
from api.models import HealthInsurance

@api_view(['POST'])
def adminAddHealthInsurance(request):
    if request.method == "POST":

        health_Insurance_Name = request.POST.get('health_Insurance_Name')
        health_Insurance_Coverage = request.POST.get('health_Insurance_Coverage')
        health_Insurance_Enrollment = request.POST.get('health_Insurance_Enrollment')
        health_Insurance_Contact = request.POST.get('health_Insurance_Contact')

        healthinsurance = {
            'health_Insurance_Name': health_Insurance_Name,
            'health_Insurance_Coverage': health_Insurance_Coverage,
            'health_Insurance_Enrollment': health_Insurance_Enrollment,
            'health_Insurance_Contact': health_Insurance_Contact,
        }
        serializer = HealthInsuranceSerializer(data=healthinsurance)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Health Insurance Successfully"})
        return Response({"message": "Add Health Insurance Failed"})
    return Response({"message": "Add Health Insurance Error"})

@api_view(['GET'])
def adminGetHealthInsurance(request):
    if request.method == "GET":
        data = HealthInsurance.objects.all()
        serializer = HealthInsuranceSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Health Insurance Error"})

@api_view(['GET'])
def adminGetHealthInsuranceInfo(request, health_Insurance_Id):
    if request.method == "GET":
        healthinsurance = HealthInsurance.objects.get(pk=health_Insurance_Id)
        serializer = HealthInsuranceSerializer(healthinsurance)
        return Response(serializer.data)
    return Response({"message": "Get Health Insurance Info Error"})

@api_view(['PUT'])
def adminEditHealthInsurance(request, health_Insurance_Id):
    if request.method == "PUT":

        health_Insurance_Name = request.POST.get('health_Insurance_Name')
        health_Insurance_Coverage = request.POST.get('health_Insurance_Coverage')
        health_Insurance_Enrollment = request.POST.get('health_Insurance_Enrollment')
        health_Insurance_Contact = request.POST.get('health_Insurance_Contact')

        healthinsurance = HealthInsurance.objects.get(pk=health_Insurance_Id)
        healthinsurance.health_Insurance_Name = health_Insurance_Name
        healthinsurance.health_Insurance_Coverage = health_Insurance_Coverage
        healthinsurance.health_Insurance_Enrollment = health_Insurance_Enrollment
        healthinsurance.health_Insurance_Contact = health_Insurance_Contact
        healthinsurance.save()
        return Response({"message": "Edit Health Insurance Success"})
    return Response({"message": "Edit Health Insurance Error"})

@api_view(['DELETE'])
def adminDeleteHealthInsurance(request, health_Insurance_Id):
    if request.method == "DELETE":
        healthinsurance = HealthInsurance.objects.get(pk=health_Insurance_Id)
        healthinsurance.delete()
        return Response({"message": "Delete Health Insurance Success"})
    return Response({"message": "Delete Health Insurance Error"})