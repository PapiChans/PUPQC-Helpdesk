from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FinancialAndScholarshipGuideSerializer
from api.models import FinancialAndScholarshipGuide

@api_view(['GET'])
def studGetFinancialAid(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FinancialAndScholarshipGuide.objects.all().filter(guide_Type = 'Financial Aid')
            serializer = FinancialAndScholarshipGuideSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Financial Aid Error"})

@api_view(['GET'])
def studGetScholarships(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FinancialAndScholarshipGuide.objects.all().filter(guide_Type = 'Scholarship')
            serializer = FinancialAndScholarshipGuideSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Scholarships Error"})

@api_view(['GET'])
def studGetGuideInfo(request, guide_Number):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            guide = FinancialAndScholarshipGuide.objects.get(guide_Number=guide_Number)
            serializer = FinancialAndScholarshipGuideSerializer(guide)
            return Response(serializer.data)
        return Response({"message": "Get Guide Info Error"})