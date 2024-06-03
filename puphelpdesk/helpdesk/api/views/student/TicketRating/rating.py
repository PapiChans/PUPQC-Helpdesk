from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from api.serializers import TicketRatingSerializer, AuditTrailSerializer
from api.models import TicketRating, Ticket, AdminProfile, AuditTrail

# For Email Sending
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_ticket_rating_notification(admin_Emails, admin_Office, ticket_Number, ticket_Rating, rating_map):
    subject = 'Ticket Rated'
    html_content = """
<html>
<head>
    <style>
        .paragraph {{
            margin-bottom: 20px;
        }}
        .working-hours {{
            font-weight: bold;
        }}
        .app-team {{
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col">
                <p class="paragraph">This is an auto-generated email, <strong>DO NOT REPLY.</strong></p>
                <p class="paragraph">Dear {admin_Office} - Administrator,</p>
                <p class="paragraph">The ticket <strong>{ticket_Number}</strong> has been rated your performance.</p>
                <p class="paragraph"><strong>Ticket Rating:</strong> <span style="font-size: 20px;">{ticket_Rating}/5 - {rating_map}</span></p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Help Desk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(admin_Office=admin_Office, ticket_Number=ticket_Number, ticket_Rating=ticket_Rating, rating_map=rating_map)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, admin_Emails)
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)

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
                '1': 'Poor',
                '2': 'Fair',
                '3': 'Average',
                '4': 'Good',
                '5': 'Excellent'
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

                    studRateTicketaudit(ticket.ticket_Number, ticket.full_Name)

                    # Get Admins Email
                    getAdmins = AdminProfile.objects.filter(admin_Office=ticket.ticket_Office).values_list('admin_Email', flat=True)
                    getSuperAdmins = AdminProfile.objects.filter(is_master_admin=True).values_list('admin_Email', flat=True)
                    print("Admin Emails:", getAdmins)  # Print admin emails for debugging

                    # If no admins are fetched, don't trigger the email notification
                    if getAdmins:
                        # Send notification to all admins
                        send_ticket_rating_notification(getAdmins, ticket.ticket_Office, ticket_number, ticket_rating, rating_map.get(ticket_rating))
                        send_ticket_rating_notification(getSuperAdmins, ticket.ticket_Office, ticket_number, ticket_rating, rating_map.get(ticket_rating))


                    return Response({"message": "Ticket rating submitted successfully"})
                return Response(serializer.errors)
            else:
                return Response({"message": "Ticket does not exist"})

        return Response({"message": "Invalid request method"})
    
def studRateTicketaudit(ticket_Number, full_Name):

    audit_data = {
        'audit_Reference': ticket_Number,
        'audit_User': full_Name,
        'audit_Action': "Rated",
        'audit_Description': f"Ticket {ticket_Number} has been rated."
    }
    serializer = AuditTrailSerializer(data=audit_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Add Trail Successfully"})

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