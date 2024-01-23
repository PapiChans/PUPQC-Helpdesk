from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import JobSearchSerializer
from api.models import JobSearch

@api_view(['GET'])
def studGetJobSearch(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobSearch.objects.all()
            serializer = JobSearchSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Job Search Error"})