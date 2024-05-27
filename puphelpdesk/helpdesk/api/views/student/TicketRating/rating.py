from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from api.serializers import TicketRatingSerializer
from api.models import TicketRating, Ticket

@api_view(['POST'])
def studSubmitTicketRating(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            ticket_number = request.POST.get('ticket_Number')
            ticket_office = request.POST.get('ticket_Office')
            ticket_rating = request.POST.get('ticket_Rating')
            ticket_remarks = request.POST.get('ticket_Remarks')

            # Mapping ratings to descriptions
            rating_map = {
                '1': 'Very Dissatisfied',
                '2': 'Dissatisfied',
                '3': 'Neutral',
                '4': 'Satisfied',
                '5': 'Very Satisfied'
            }

            # Get the associated Ticket object
            ticket = Ticket.objects.filter(ticket_Number=ticket_number).first()

            # Create TicketRating instance
            if ticket:
                ticket_rating_data = {
                    'ticket_Number': ticket_number,
                    'ticket_Office': ticket_office,
                    'ticket_Rating': rating_map.get(ticket_rating),  # Get description from rating_map
                    'date_Created': ticket.date_Created,  # Using date_Created from associated Ticket
                    'resolved_Date': timezone.now().isoformat(),  # Using current date and time in ISO format
                    'ticket_Remarks': ticket_remarks if ticket_remarks else None,  # Set ticket_remarks to None if empty
                }

                serializer = TicketRatingSerializer(data=ticket_rating_data)
                if serializer.is_valid():
                    serializer.save()

                    # Update ticket status to 'Resolved'
                    ticket.ticket_Status = 'Resolved'
                    ticket.resolved_Date = timezone.now().isoformat()
                    ticket.save()

                    return Response({"message": "Ticket rating submitted successfully"})
                return Response(serializer.errors)
            else:
                return Response({"message": "Ticket does not exist"})

        return Response({"message": "Invalid request method"})

@api_view(['PUT'])
def studTicketReOpen(request, ticket_Number):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            try:
                ticket = Ticket.objects.get(ticket_Number=ticket_Number)
                if ticket.ticket_Status != 'Re-Open':
                    ticket.ticket_Status = 'Re-Open'
                    ticket.save()
                    return Response({"message": "Ticket Re-Open Success"})
                else:
                    return Response({"message": "Ticket is already Re-Opened"})
            except Ticket.DoesNotExist:
                return Response({"message": "Ticket does not exist"})
        return Response({"message": "Ticket Re-Open Error"})