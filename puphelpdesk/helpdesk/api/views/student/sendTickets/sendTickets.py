from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import SendTicketSerializer, FAQSerializer
from api.models import SendTicket, FAQ, UserProfile
from django.core.files.storage import FileSystemStorage
import os
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status

# For Email Sending
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_email_to_owner(sender_Email, sender_Name, ticket_number):
    subject = 'Your Ticket has been submitted'
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
                <p class="paragraph">This is an auto-generated E-mail, <strong>DO NOT REPLY.</strong></p>
                <p class="paragraph">Dear {sender_Name},</p>
                <p class="paragraph">Thank you for creating a ticket. Your request has been received and will be reviewed shortly.</p>
                <p class="paragraph"><strong>Ticket Number:</strong> <span style="font-size: 20px;">{ticket_number}</span></p>
                <p class="paragraph">The Administrator will process your ticket during our <strong class="working-hours">working hours</strong>, Monday to Saturday, from 8:00 AM to 5:00 PM.</p>
                <p class="paragraph">Thank you for your patience and cooperation.</p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Helpdesk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(sender_Name=sender_Name, ticket_number=ticket_number)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [sender_Email])
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)

User = get_user_model()

@api_view(['POST'])
def clientAddTickets(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == "POST":
        try:
            # Fetching the current date
            today = timezone.now().date()

            # Get the count of tickets created today
            ticket_count_today = SendTicket.objects.filter(date_Submitted__date=today).count() + 1

            # Generate the ticket number
            sender_Email = request.data.get('sender_Email')
            if not sender_Email:
                return Response({"message": "sender_Email is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            ticket_Number = f'T{today.strftime("%Y%m%d")}-{str(ticket_count_today).zfill(3)}'
            sender_Name = request.data.get('sender_Name')
            if not sender_Name:
                return Response({"message": "sender_Name is required"}, status=status.HTTP_400_BAD_REQUEST)

            ticket_Type = request.data.get('ticket_Type')
            if not ticket_Type:
                return Response({"message": "ticket_Type is required"}, status=status.HTTP_400_BAD_REQUEST)

            Description = request.data.get('Description')
            if not Description:
                return Response({"message": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Get User's Email
            try:
                getUser = UserProfile.objects.get(email=sender_Email)
            except UserProfile.DoesNotExist:
                return Response({"message": "User Profile Not Found"}, status=status.HTTP_404_NOT_FOUND)

            ticket_data = {
                'sender_Email': sender_Email,
                'sender_Name': sender_Name,
                'ticket_Type': ticket_Type,
                'ticket_Number': ticket_Number,
                'ticket_Status': 'Open',
                'Description': Description,
            }

            serializer = SendTicketSerializer(data=ticket_data)
            if serializer.is_valid():
                ticket_instance = serializer.save()

                return Response({"message": "Ticket Submitted Successfully", "ticket_Number": ticket_instance.ticket_Number}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)