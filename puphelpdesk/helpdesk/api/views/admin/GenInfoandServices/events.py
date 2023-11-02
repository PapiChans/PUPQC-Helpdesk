from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import EventsSerializer
from api.models import Events

@api_view(['POST'])
def addEvent(request):
    if request.method == "POST":
        event_Name = request.POST.get('event_Name')
        event_Description = request.POST.get('event_Description')
        event_Date_Start = request.POST.get('event_Date_Start')
        event_Date_End = request.POST.get('event_Date_End')
        event_Start = request.POST.get('event_Start')
        event_End = request.POST.get('event_End')

        event = {
                'event_Name': event_Name,
                'event_Description': event_Description,
                'event_Date_Start': event_Date_Start,
                'event_Date_End': event_Date_End,
                'event_Start': event_Start,
                'event_End': event_End,
        }
        serializer = EventsSerializer(data=event)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Event Successfully"})
        return Response({"message": "Add Event Failed"})
    return Response({"message": "Add Event Error"})

@api_view(['GET'])
def getEvent(request):
    if request.method == "GET":
        data = Events.objects.all()
        serializer = EventsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Event Error"})

@api_view(['GET'])
def getEventInfo(request, event_Id):
    if request.method == "GET":
        event = Events.objects.get(pk=event_Id)
        serializer = EventsSerializer(event)
        return Response(serializer.data)
    return Response({"message": "Get Event Info Error"})