from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import SupportCounselingSerializer
from api.models import SupportCounseling

@api_view(['POST'])
def adminAddSupportCounselor(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            counselor_Name = request.POST.get('counselor_Name')
            counselor_Contact = request.POST.get('counselor_Contact')
            counselor_Specialization = request.POST.get('counselor_Specialization')
            counselor_Reach_Out = request.POST.get('counselor_Reach_Out')

            counselor = {
                'counselor_Name': counselor_Name,
                'counselor_Contact': counselor_Contact,
                'counselor_Specialization': counselor_Specialization,
                'counselor_Reach_Out': counselor_Reach_Out,
            }
            serializer = SupportCounselingSerializer(data=counselor)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Support Counseling Successfully"})
            return Response({"message": "Add Support Counseling Failed"})
        return Response({"message": "Add Support Counseling Error"})

@api_view(['GET'])
def adminGetSupportCounselor(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = SupportCounseling.objects.all()
            serializer = SupportCounselingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Support Counseling Error"})

@api_view(['GET'])
def adminGetSupportCounselorInfo(request, counselor_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            counselor = SupportCounseling.objects.get(pk=counselor_Id)
            serializer = SupportCounselingSerializer(counselor)
            return Response(serializer.data)
        return Response({"message": "Get Support Counseling Info Error"})

@api_view(['PUT'])
def adminEditSupportCounselor(request, counselor_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            counselor_Name = request.POST.get('counselor_Name')
            counselor_Contact = request.POST.get('counselor_Contact')
            counselor_Specialization = request.POST.get('counselor_Specialization')
            counselor_Reach_Out = request.POST.get('counselor_Reach_Out')

            counselor = SupportCounseling.objects.get(pk=counselor_Id)
            counselor.counselor_Name = counselor_Name
            counselor.counselor_Contact = counselor_Contact
            counselor.counselor_Specialization = counselor_Specialization
            counselor.counselor_Reach_Out = counselor_Reach_Out
            counselor.save()
            return Response({"message": "Edit Support Counselor Success"})
        return Response({"message": "Edit Support Counselor Error"})

@api_view(['DELETE'])
def adminDeleteSupportCounselor(request, counselor_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            counselor = SupportCounseling.objects.get(pk=counselor_Id)
            counselor.delete()
            return Response({"message": "Delete Support Counselor Success"})
        return Response({"message": "Delete Support Counselor Error"})