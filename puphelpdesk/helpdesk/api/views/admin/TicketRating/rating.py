from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta
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

@api_view(['GET'])
def adminSortTicketRatings(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})

    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})

    if request.method == "GET":
        # Initialize ticket ratings queryset
        ticket_ratings = TicketRating.objects.all()

        # Filter ticket ratings based on admin privileges
        if admin_profile.is_master_admin:
            # If master admin, fetch all ticket ratings
            ticket_ratings = ticket_ratings.order_by('resolved_Date')
        else:
            # If not master admin, filter ticket ratings based on their office
            ticket_ratings = ticket_ratings.filter(ticket_Office=admin_profile.admin_Office).order_by('resolved_Date')

        # Get form field values from the request
        ticket_rating = request.GET.get('ticket_rating')
        ticket_office = request.GET.get('ticket_office')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Additional filters based on form fields
        if ticket_rating:
            ticket_ratings = ticket_ratings.filter(ticket_Rating=ticket_rating)
        if ticket_office and ticket_office != 'All':
            ticket_ratings = ticket_ratings.filter(ticket_Office=ticket_office)
        if start_date and end_date:
            # Convert start_date and end_date to datetime objects
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d') + timedelta(days=1)  # Adjust end date to include all of that day
            # Filter ticket ratings within the date range
            ticket_ratings = ticket_ratings.filter(resolved_Date__range=[start_date_obj, end_date_obj])

        # Serialize the filtered tickets
        serializer = TicketRatingSerializer(ticket_ratings, many=True)

        # Return JSON response with serialized data
        return Response(serializer.data)
    else:
        return Response({"message": "Get Ticket Error"})