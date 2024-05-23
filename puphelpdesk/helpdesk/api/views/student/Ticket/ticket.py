from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer, FAQSerializer
from api.models import Ticket, TicketComment, FAQ, UserProfile
from django.core.files.storage import FileSystemStorage
import os
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

# For Email Sending
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_email_to_owner(user_Email, full_Name, ticket_number):
    subject = 'Your Ticket has been created'
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
                <p class="paragraph">Dear {full_Name},</p>
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
""".format(full_Name=full_Name, ticket_number=ticket_number)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [user_Email])
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)

User = get_user_model()

@api_view(['POST'])
def studAddTicket(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})

    if request.method == "POST":
        # Fetching the current date
        today = timezone.now().date()

        # Get the count of tickets created today
        ticket_count_today = Ticket.objects.filter(date_Created__date=today).count() + 1

        # Generate the ticket number
        ticket_Number = f'T{today.strftime("%Y%m%d")}-{str(ticket_count_today).zfill(3)}'

        user_Id = request.data.get('user_Id')  # Changed to request.data
        full_Name = request.data.get('full_Name')  # Changed to request.data
        sender_Affiliation = request.data.get('sender_Affiliation')  # Changed to request.data
        ticket_Type = request.data.get('ticket_Type')  # Changed to request.data
        ticket_Priority = request.data.get('ticket_Priority')
        ticket_Title = request.data.get('ticket_Title')  # Changed to request.data
        comment_Text = request.data.get('comment_Text')  # Changed to request.data
        ticket_Office = request.data.get('ticket_Office')  # Get ticket office
        ticket_Service = request.data.get('ticket_Service')

        # Get User's Email
        getUser = UserProfile.objects.get(user_Id=user_Id)

        ticket_data = {
            'user_Id': user_Id,
            'full_Name': full_Name,
            'sender_Affiliation': sender_Affiliation,
            'ticket_Type': ticket_Type,
            'ticket_Number': ticket_Number,
            'ticket_Status': 'Pending',
            'ticket_Priority': ticket_Priority,
            'ticket_Title': ticket_Title,
            'ticket_Office': ticket_Office,
            'ticket_Service': ticket_Service,
        }
        serializer = TicketSerializer(data=ticket_data)
        if serializer.is_valid():
            ticket_instance = serializer.save()

            # Retrieve the ticket using the saved ticket instance
            ticket_number = ticket_instance.ticket_Number

            comment_data = {
                'user_Id': user_Id,
                'full_Name': full_Name,
                'sender_Affiliation': sender_Affiliation,
                'ticket_Id': ticket_instance.ticket_Id,
                'ticket_Type': ticket_Type,
                'comment_Text': comment_Text,
                'comment_Attachment': None,
            }
            comment_serializer = TicketCommentSerializer(data=comment_data)
            if comment_serializer.is_valid():
                # Save the ticket comment
                comment_serializer.save()
                # send_email_to_owner(getUser.user_Email, full_Name, ticket_number)
                return Response({"message": "Submit Ticket and Comment Successfully", "ticket_Number": ticket_number})

        return Response({"message": "Submit Ticket Failed"})

    return Response({"message": "Submit Ticket Error"})
    
@api_view(['GET'])
def studGetTicketbyUser(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(user_Id=request.user.user_Id).order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def studGetTicketInfo(request, ticket_Number):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.get(ticket_Number=ticket_Number)
            serializer = TicketSerializer(data)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['POST'])
def studAddTicketComment(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            user_Id = request.POST.get('user_Id')
            full_Name = request.POST.get('full_Name')
            sender_Affiliation = request.POST.get('sender_Affiliation')
            ticket_Type = request.POST.get('ticket_Type')
            ticket_Id = request.POST.get('ticket_Id')
            comment_Text = request.POST.get('comment_Text')

            # Check if 'comment_Attachment' is in request.FILES
            if 'comment_Attachment' in request.FILES:
                comment_Attachment = request.FILES['comment_Attachment']
            else:
                comment_Attachment = None

            comment = {
                'user_Id': user_Id,
                'full_Name': full_Name,
                'sender_Affiliation': sender_Affiliation,
                'ticket_Id': ticket_Id,
                'ticket_Type': ticket_Type,
                'comment_Text': comment_Text,
                'comment_Attachment': comment_Attachment,
            }

            serializer = TicketCommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()

                ticket = Ticket.objects.get(pk=ticket_Id)
                ticket.save()
                return Response({"message": "Add Comment Successfully"})
            return Response({"message": "Add Comment Failed"})

        return Response({"message": "Add Comment Error"})
    
@api_view(['GET'])
def studGetTicketComment(request, ticket_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = TicketComment.objects.all().filter(ticket_Id=ticket_Id).order_by('date_Created')
            serializer = TicketCommentSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def studGetTicketFAQ(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FAQ.objects.all().filter(FAQ_Category = 'Ticket System Questions').order_by('FAQ_Category')
            serializer = FAQSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get FAQ Error"})
    
@api_view(['GET'])
def studverifyTicketInfo(request, ticket_Number):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            try:
                data = Ticket.objects.get(ticket_Number=ticket_Number)
                if data.user_Id_id == request.user.user_Id:
                    return Response({"code": 200})
                else:
                    return Response({"code": 401})
            except ObjectDoesNotExist:
                return Response({"code": 404})
        return Response({"message": "Get Ticket Error"})