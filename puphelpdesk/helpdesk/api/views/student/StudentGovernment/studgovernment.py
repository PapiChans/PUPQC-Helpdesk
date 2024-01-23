from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import StudentGovernmentSerializer
from api.models import StudentGovernment

@api_view(['GET'])
def studGetGovernment(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = StudentGovernment.objects.all()
            serializer = StudentGovernmentSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Student Government Error"})

@api_view(['GET'])
def studGetGovernmentInfo(request, government_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            government = StudentGovernment.objects.get(pk=government_Id)
            serializer = StudentGovernmentSerializer(government)
            return Response(serializer.data)
        return Response({"message": "Get Student Government Info Error"})