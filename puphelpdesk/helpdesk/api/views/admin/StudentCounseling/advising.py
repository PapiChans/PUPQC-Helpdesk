from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import AcademicAdvisingSerializer
from api.models import AcademicAdvising

@api_view(['POST'])
def adminAddAcademicAdviser(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            adviser_Name = request.POST.get('adviser_Name')
            adviser_Contact = request.POST.get('adviser_Contact')
            adviser_Specialization = request.POST.get('adviser_Specialization')
            adviser_Reach_Out = request.POST.get('adviser_Reach_Out')

            adviser = {
                'adviser_Name': adviser_Name,
                'adviser_Contact': adviser_Contact,
                'adviser_Specialization': adviser_Specialization,
                'adviser_Reach_Out': adviser_Reach_Out,
            }
            serializer = AcademicAdvisingSerializer(data=adviser)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Academic Adviser Successfully"})
            return Response({"message": "Add Academic Adviser Failed"})
        return Response({"message": "Add Academic Adviser Error"})

@api_view(['GET'])
def adminGetAcademicAdviser(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = AcademicAdvising.objects.all()
            serializer = AcademicAdvisingSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Academic Adviser Error"})

@api_view(['GET'])
def adminGetAcademicAdviserInfo(request, adviser_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            adviser = AcademicAdvising.objects.get(pk=adviser_Id)
            serializer = AcademicAdvisingSerializer(adviser)
            return Response(serializer.data)
        return Response({"message": "Get Academic Adviser Info Error"})

@api_view(['PUT'])
def adminEditAcademicAdviser(request, adviser_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            adviser_Name = request.POST.get('adviser_Name')
            adviser_Contact = request.POST.get('adviser_Contact')
            adviser_Specialization = request.POST.get('adviser_Specialization')
            adviser_Reach_Out = request.POST.get('adviser_Reach_Out')

            adviser = AcademicAdvising.objects.get(pk=adviser_Id)
            adviser.adviser_Name = adviser_Name
            adviser.adviser_Contact = adviser_Contact
            adviser.adviser_Specialization = adviser_Specialization
            adviser.adviser_Reach_Out = adviser_Reach_Out
            adviser.save()
            return Response({"message": "Edit Academic Adviser Success"})
        return Response({"message": "Edit Academic Adviser Error"})

@api_view(['DELETE'])
def adminDeleteAcademicAdviser(request, adviser_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            adviser = AcademicAdvising.objects.get(pk=adviser_Id)
            adviser.delete()
            return Response({"message": "Delete Academic Adviser Success"})
        return Response({"message": "Delete Academic Adviser Error"})