from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import EventsSerializer
from api.models import Events

@api_view(['GET'])
def studfetchEvent(request):
    if request.method == "GET":
        data = Events.objects.all()
        if data.exists():
            # Serialize the events data if needed
            serialized_data = EventsSerializer(data, many=True).data
            return Response({"message": "Have fetched Events", "events": serialized_data})
        else:
            return Response({"message": "No fetched Events"})
    return Response({"message": "Get Event Error"})
