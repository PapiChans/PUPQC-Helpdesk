from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import IDandCardSerializer
from api.models import IDandCard

@api_view(['GET'])
def studGetObtainingStep(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = IDandCard.objects.all().filter(guide_Type = 'Obtaining ID').order_by('guide_Step_Number')
            serializer = IDandCardSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Guide Error"})

@api_view(['GET'])
def studGetReplacingStep(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = IDandCard.objects.all().filter(guide_Type = 'Replacing ID').order_by('guide_Step_Number')
            serializer = IDandCardSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Guide Error"})

@api_view(['GET'])
def studGetAccessCardStep(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = IDandCard.objects.all().filter(guide_Type = 'Access Card').order_by('guide_Step_Number')
            serializer = IDandCardSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Guide Error"})