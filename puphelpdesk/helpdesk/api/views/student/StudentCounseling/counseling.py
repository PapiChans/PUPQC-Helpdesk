from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import SupportCounselingSerializer
from api.models import SupportCounseling

@api_view(['GET'])
def studGetSupportCounselor(request):
    if request.method == "GET":
        data = SupportCounseling.objects.all()
        serializer = SupportCounselingSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Support Counseling Error"})

@api_view(['GET'])
def studGetSupportCounselorInfo(request, counselor_Id):
    if request.method == "GET":
        counselor = SupportCounseling.objects.get(pk=counselor_Id)
        serializer = SupportCounselingSerializer(counselor)
        return Response(serializer.data)
    return Response({"message": "Get Support Counseling Info Error"})