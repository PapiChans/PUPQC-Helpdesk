from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import RetrievalInstructionSerializer
from api.models import RetrievalInstruction

@api_view(['POST'])
def adminAddInstruction(request):
    if request.method == "POST":

        instruction_Step_Number = request.POST.get('instruction_Step_Number')
        instruction_Title = request.POST.get('instruction_Title')
        instruction_Info = request.POST.get('instruction_Info')

        instruction = {
            'instruction_Step_Number': instruction_Step_Number,
            'instruction_Title': instruction_Title,
            'instruction_Info': instruction_Info,
        }
        serializer = RetrievalInstructionSerializer(data=instruction)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Retrieval Instruction Successfully"})
        return Response({"message": "Add Retrieval Instruction Failed"})
    return Response({"message": "Add Retrieval Instruction Error"})

@api_view(['GET'])
def adminGetInstruction(request):
    if request.method == "GET":
        data = RetrievalInstruction.objects.all().order_by('instruction_Step_Number')
        serializer = RetrievalInstructionSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Retrieval Instruction Error"})

@api_view(['GET'])
def adminGetInstructionInfo(request, instruction_Id):
    if request.method == "GET":
        info = RetrievalInstruction.objects.get(pk=instruction_Id)
        serializer = RetrievalInstructionSerializer(info)
        return Response(serializer.data)
    return Response({"message": "Get Retrieval Instruction Info Error"})

@api_view(['PUT'])
def adminEditInstruction(request, instruction_Id):
    if request.method == "PUT":

        instruction_Step_Number = request.POST.get('instruction_Step_Number')
        instruction_Title = request.POST.get('instruction_Title')
        instruction_Info = request.POST.get('instruction_Info')

        instruction = RetrievalInstruction.objects.get(pk=instruction_Id)
        instruction.instruction_Step_Number = instruction_Step_Number
        instruction.instruction_Title = instruction_Title
        instruction.instruction_Info = instruction_Info
        instruction.save()
        return Response({"message": "Edit Retrieval Instruction Success"})
    return Response({"message": "Edit Retrieval Instruction Error"})

@api_view(['DELETE'])
def adminDeleteInstruction(request, instruction_Id):
    if request.method == "DELETE":
        instruction = RetrievalInstruction.objects.get(pk=instruction_Id)
        instruction.delete()
        return Response({"message": "Delete Retrieval Instruction Success"})
    return Response({"message": "Delete Retrieval Instruction Error"})