from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer
from api.models import Ticket, TicketComment, UserProfile, User
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

def send_email_replied(user_Email, full_Name, ticket_number, comment_Text):
    subject = 'Your Ticket has been replied'
    # Replace line breaks in the comment text with </p><p>
    comment_Text_with_breaks = "</p><p>".join(comment_Text.split("\n"))
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
        .admin-reply {{
            background-color: #f2f2f2;
            padding: 10px;
            border-radius: 5px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col">
                <p class="paragraph">This is an auto-generated E-mail, <strong>DO NOT REPLY.</strong></p>
                <p class="paragraph">Dear {full_Name},</p>
                <p class="paragraph">Thank you for reaching out to us. Your ticket number <strong>{ticket_number}</strong>, has been replied by the administrator.</p>
                <p class="paragraph"><strong>Administrator's Reply:</strong></p>
                <div class="admin-reply">
                    <p>{comment_Text_with_breaks}</p>
                </div>
                <p class="paragraph">Please log in to the system to view the administrator's reply and continue the conversation.</p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Helpdesk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(full_Name=full_Name, ticket_number=ticket_number, comment_Text_with_breaks=comment_Text_with_breaks)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [user_Email])
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)

@api_view(['GET'])
def adminGetPendingTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='Pending').order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetResponseTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='Replied').order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetClosedTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='Closed').order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetAllTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.exclude(ticket_Status__in=['Closed']).order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetTicketInfo(request, ticket_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.get(ticket_Number=ticket_Number)
            serializer = TicketSerializer(data)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetTicketComment(request, ticket_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = TicketComment.objects.all().filter(ticket_Id=ticket_Id).order_by('date_Created')
            serializer = TicketCommentSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['POST'])
def adminAddTicketComment(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            user_Id = request.POST.get('user_Id')
            full_Name = request.POST.get('full_Name')
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
                'ticket_Id': ticket_Id,
                'comment_Text': comment_Text,
                'comment_Attachment': comment_Attachment,
            }

            #Get Ticket Number
            ticket_info = Ticket.objects.get(ticket_Id=ticket_Id)
            
            # Retrieve the associated UserProfile object directly using the user_Id (which is a UUID)
            user_profile = UserProfile.objects.get(user_Id=ticket_info.user_Id)

            serializer = TicketCommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()

                ticket = Ticket.objects.get(pk=ticket_Id)
                ticket.save()
                return Response({"message": "Add Comment Successfully"})
            return Response({"message": "Add Comment Failed"})

        return Response({"message": "Add Comment Error"})
    
@api_view(['DELETE'])
def adminCloseTicket(request, ticket_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            ticket = Ticket.objects.get(pk=ticket_Id)
            # Retrieve the associated UserProfile object directly using the user_Id (which is a UUID)
            user_profile = UserProfile.objects.get(user_Id=ticket.user_Id)
            ticket.ticket_Status = 'Closed'
            ticket.save()
            return Response({"message": "Close Ticket Successfully"})
        return Response({"message": "Close Ticket Failed"})
    
@api_view(['GET'])
def adminverifyTicketInfo(request, ticket_Number):
    if request.user.is_anonymous or not request.user.is_admin:
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
    
def send_email_closed(user_Email, full_Name, ticket_number):
    subject = 'Your Ticket has been closed'
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
                <p class="paragraph">Dear {full_Name},</p>
                <p class="paragraph">Your ticket with number <strong>{ticket_number}</strong> has been closed.</p>
                <p class="paragraph">If you have any further questions or issues, please feel free to create a new ticket.</p>
                <p class="paragraph">Thank you for your cooperation.</p>
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
    
@api_view(['POST'])
def updateTicketPriority(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    ticket_number = request.POST.get('ticketNumber')
    new_priority = request.POST.get('newPriority')
    
    try:
        ticket = Ticket.objects.get(ticket_Number=ticket_number)
        ticket.ticket_Priority = new_priority
        ticket.save()
        return Response({"message": "Priority updated successfully"})
    except Ticket.DoesNotExist:
        return Response({"message": "Ticket not found"}, status=404)

@api_view(['POST'])
def updateTicketStatus(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    ticket_number = request.POST.get('ticketNumber')
    new_status = request.POST.get('newStatus')
    
    try:
        ticket = Ticket.objects.get(ticket_Number=ticket_number)
        ticket.ticket_Status = new_status
        ticket.save()
        return Response({"message": "Status updated successfully"})
    except Ticket.DoesNotExist:
        return Response({"message": "Ticket not found"}, status=404)