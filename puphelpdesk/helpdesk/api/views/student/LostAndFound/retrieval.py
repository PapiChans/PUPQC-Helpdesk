from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import RetrievalInstructionSerializer
from api.models import RetrievalInstruction

@api_view(['GET'])
def studGetInstruction(request):
    if request.method == "GET":
        data = RetrievalInstruction.objects.all().order_by('instruction_Step_Number')
        serializer = RetrievalInstructionSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Retrieval Instruction Error"})