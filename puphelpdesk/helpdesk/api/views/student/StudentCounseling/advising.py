from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import AcademicAdvisingSerializer
from api.models import AcademicAdvising

@api_view(['GET'])
def studGetAcademicAdviser(request):
    if request.method == "GET":
        data = AcademicAdvising.objects.all()
        serializer = AcademicAdvisingSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Academic Adviser Error"})

@api_view(['GET'])
def studGetAcademicAdviserInfo(request, adviser_Id):
    if request.method == "GET":
        adviser = AcademicAdvising.objects.get(pk=adviser_Id)
        serializer = AcademicAdvisingSerializer(adviser)
        return Response(serializer.data)
    return Response({"message": "Get Academic Adviser Info Error"})