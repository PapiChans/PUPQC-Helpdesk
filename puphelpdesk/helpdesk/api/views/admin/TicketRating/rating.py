from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from api.serializers import TicketRatingSerializer
from api.models import TicketRating, Ticket, AdminProfile

@api_view(['GET'])
def adminGetAllTicketRating(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})
    
    if request.method == "GET":
        if admin_profile.is_master_admin:
            ticket_ratings = TicketRating.objects.all().order_by('date_Created')
        else:
            # Assuming admin office is linked to ticket office in some way
            ticket_ratings = TicketRating.objects.filter(ticket_Office=admin_profile.admin_Office).order_by('date_Created')

        serializer = TicketRatingSerializer(ticket_ratings, many=True)
        return Response(serializer.data)
    else:
        return Response({"message": "Invalid request method"})
