from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import CareerCounselingSerializer
from api.models import CareerCounseling

@api_view(['GET'])
def studGetCounseling(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = CareerCounseling.objects.all()
            serializer = CareerCounselingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Career Counseling Error"})

@api_view(['GET'])
def studGetCounselingInfo(request, counseling_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            counseling = CareerCounseling.objects.get(pk=counseling_Id)
            serializer = CareerCounselingSerializer(counseling)
            return Response(serializer.data)
        return Response({"message": "Get Career Counseling Info Error"})