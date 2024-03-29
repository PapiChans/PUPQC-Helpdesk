from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import EventsSerializer, JobPostingSerializer, LostandFoundSerializer
from api.models import Events, JobPosting, LostandFound

@api_view(['GET'])
def studfetchEvent(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Events.objects.all()
            if data.exists():
                # Serialize the events data if needed
                serialized_data = EventsSerializer(data, many=True).data
                return Response({"message": "Have fetched Events", "events": serialized_data})
            else:
                return Response({"message": "No fetched Events"})
        return Response({"message": "Get Event Error"})

@api_view(['GET'])
def studfetchJobPosting(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = JobPosting.objects.all()
            if data.exists():
                # Serialize the events data if needed
                serialized_data = JobPostingSerializer(data, many=True).data
                return Response({"message": "Have fetched Job Post", "jobpost": serialized_data})
            else:
                return Response({"message": "No fetched Job Posts"})
        return Response({"message": "Get Job Post Error"})
    
@api_view(['GET'])
def studfetchLostItem(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = LostandFound.objects.all().filter(user_Id=request.user.user_Id, item_Status='Claim Verification').exists()
            if data:
                return Response({"message": "Have Claim Items"})
            else:
                return Response({"message": "Claim Items Not Found"})
        return Response({"message": "Get Lost Item Error"})