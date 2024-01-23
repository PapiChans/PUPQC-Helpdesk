from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FAQSerializer
from api.models import FAQ

@api_view(['GET'])
def studGetFAQ(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FAQ.objects.all().order_by('FAQ_Category')
            serializer = FAQSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get FAQ Error"})