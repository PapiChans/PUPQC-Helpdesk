from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import CareerCounselingSerializer
from api.models import CareerCounseling

@api_view(['POST'])
def adminAddCounseling(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            counseling_Name = request.POST.get('counseling_Name')
            counseling_Contact = request.POST.get('counseling_Contact')
            counseling_Location = request.POST.get('counseling_Location')
            counseling_Service = request.POST.get('counseling_Service')

            counseling = {
                'counseling_Name': counseling_Name,
                'counseling_Contact': counseling_Contact,
                'counseling_Location': counseling_Location,
                'counseling_Service': counseling_Service,
            }
            serializer = CareerCounselingSerializer(data=counseling)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Career Counseling Successfully"})
            return Response({"message": "Add Career Counseling Failed"})
        return Response({"message": "Add Career Counseling Error"})

@api_view(['GET'])
def adminGetCounseling(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = CareerCounseling.objects.all()
            serializer = CareerCounselingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Career Counseling Error"})

@api_view(['GET'])
def adminGetCounselingInfo(request, counseling_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            counseling = CareerCounseling.objects.get(pk=counseling_Id)
            serializer = CareerCounselingSerializer(counseling)
            return Response(serializer.data)
        return Response({"message": "Get Career Counseling Info Error"})

@api_view(['PUT'])
def adminEditCounseling(request, counseling_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            counseling_Name = request.POST.get('counseling_Name')
            counseling_Contact = request.POST.get('counseling_Contact')
            counseling_Location = request.POST.get('counseling_Location')
            counseling_Service = request.POST.get('counseling_Service')

            counseling = CareerCounseling.objects.get(pk=counseling_Id)
            counseling.counseling_Name = counseling_Name
            counseling.counseling_Contact = counseling_Contact
            counseling.counseling_Location = counseling_Location
            counseling.counseling_Service = counseling_Service
            counseling.save()
            return Response({"message": "Edit Career Counseling Success"})
        return Response({"message": "Edit Career Counseling Error"})

@api_view(['DELETE'])
def adminDeleteCounseling(request, counseling_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            counseling = CareerCounseling.objects.get(pk=counseling_Id)
            counseling.delete()
            return Response({"message": "Delete Career Counseling Success"})
        return Response({"message": "Delete Career Counseling Error"})