from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import JobSearchSerializer
from api.models import JobSearch

@api_view(['GET'])
def studGetJobSearch(request):
    if request.method == "GET":
        data = JobSearch.objects.all()
        serializer = JobSearchSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Job Search Error"})