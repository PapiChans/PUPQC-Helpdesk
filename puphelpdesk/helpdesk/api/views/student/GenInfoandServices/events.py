from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import EventsSerializer
from api.models import Events
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def studGetEvent(request):
    if request.method == "GET":
        data = Events.objects.all().order_by('event_Date_Start')
        serializer = EventsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Event Error"})

@api_view(['GET'])
def studGetEventInfo(request, event_Id):
    if request.method == "GET":
        event = Events.objects.get(pk=event_Id)
        serializer = EventsSerializer(event)
        return Response(serializer.data)
    return Response({"message": "Get Event Info Error"})