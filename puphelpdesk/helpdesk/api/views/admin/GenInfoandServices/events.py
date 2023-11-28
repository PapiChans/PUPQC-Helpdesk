from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import EventsSerializer
from api.models import Events
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def adminAddEvent(request):
    if request.method == "POST":

        event_Type = request.POST.get('event_Type')
        event_Name = request.POST.get('event_Name')
        event_Description = request.POST.get('event_Description')
        event_Date_Start = request.POST.get('event_Date_Start')
        event_Date_End = request.POST.get('event_Date_End')
        event_Start = request.POST.get('event_Start')
        event_End = request.POST.get('event_End')
        event_Venue = request.POST.get('event_Venue')

        event = {
                'event_Type': event_Type,
                'event_Name': event_Name,
                'event_Description': event_Description,
                'event_Date_Start': event_Date_Start,
                'event_Date_End': event_Date_End,
                'event_Start': event_Start,
                'event_End': event_End,
                'event_Venue': event_Venue,
        }
        serializer = EventsSerializer(data=event)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Event Successfully"})
        return Response({"message": "Add Event Failed"})
    return Response({"message": "Add Event Error"})

@api_view(['GET'])
def adminGetEvent(request):
    if request.method == "GET":
        data = Events.objects.all().order_by('event_Date_Start')
        serializer = EventsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Event Error"})

@api_view(['GET'])
def adminGetEventInfo(request, event_Id):
    if request.method == "GET":
        event = Events.objects.get(pk=event_Id)
        serializer = EventsSerializer(event)
        return Response(serializer.data)
    return Response({"message": "Get Event Info Error"})

@api_view(['DELETE'])
def adminDeleteEvent(request, event_Id):
    if request.method == "DELETE":
        try:
            event = Events.objects.get(pk=event_Id)
            file = event.event_Image.path
            event.delete()
            if os.path.exists(file):
                os.remove(file)
            return Response({"message": "Delete Event Success"})
        except:
            event.delete()
    return Response({"message": "Delete Event Error"})

@api_view(['PUT'])
def adminEditEvent(request, event_Id):
    if request.method == "PUT":

        event_Type = request.POST.get('event_Type')
        event_Name = request.POST.get('event_Name')
        event_Description = request.POST.get('event_Description')
        event_Date_Start = request.POST.get('event_Date_Start')
        event_Date_End = request.POST.get('event_Date_End')
        event_Start = request.POST.get('event_Start')
        event_End = request.POST.get('event_End')
        event_Venue = request.POST.get('event_Venue')

        event = Events.objects.get(pk=event_Id)
        event.event_Type = event_Type
        event.event_Name = event_Name
        event.event_Description = event_Description
        event.event_Date_Start = event_Date_Start
        event.event_Date_End = event_Date_End
        event.event_Start = event_Start
        event.event_End = event_End
        event.event_Venue = event_Venue
        event.save()
        return Response({"message": "Edit Event Success"})
    return Response({"message": "Edit Event Error"})

@api_view(['POST'])
def adminUploadEventImage(request, event_Id):
    if request.method == "POST" and 'event_Image' in request.FILES:
        
        event_Image = request.FILES['event_Image']
        event = Events.objects.get(pk=event_Id)
        event.event_Image = event_Image
        event.save()

        return Response({"message": "Upload Event Image Success"})
    return Response({"message": "Upload Event Image Error"})

@api_view(['DELETE'])
def adminDeleteEventImage(request, event_Id):
    if request.method == "DELETE":
        
        event = Events.objects.get(pk=event_Id)
        file = event.event_Image.path
        if os.path.exists(file):
            os.remove(file)
        event.event_Image = None
        event.save()

        return Response({"message": "Delete Event Image Success"})
    return Response({"message": "Delete Event Image Error"})