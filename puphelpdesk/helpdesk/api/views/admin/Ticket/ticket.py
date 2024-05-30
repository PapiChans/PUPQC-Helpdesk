from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer
from api.models import Ticket, TicketComment, UserProfile, User, AdminProfile
from django.core.files.storage import FileSystemStorage
import os
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta

# For Email Sending
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_email_replied(user_Email, full_Name, ticket_number):
    subject = 'Your Ticket has been replied'
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
                <p class="paragraph">Please log in to the system to view the administrator's reply and continue the conversation. <a href="https://pupqc-helpdesk.onrender.com/login">Click here</a> to login</p>
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

def send_assigned_ticket_notification(admin_Emails, admin_Office, ticket_number):
    subject = 'New Ticket Re-Assigned'
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
                <p class="paragraph">A new ticket has been moved and re-assigned to your office.</p>
                <p class="paragraph"><strong>Ticket Number:</strong> <span style="font-size: 20px;">{ticket_number}</span></p>
                <p class="paragraph">Please review the ticket and take appropriate action.</p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Help Desk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(admin_Office=admin_Office, ticket_number=ticket_number)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, admin_Emails)
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
    
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})
    
    if request.method == "GET":
        if admin_profile.is_master_admin:
            tickets = Ticket.objects.all().order_by('date_Created')
        else:
            tickets = Ticket.objects.all().filter(ticket_Office=admin_profile.admin_Office).order_by('date_Created')

        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
    else:
        return Response({"message": "Invalid request method"})
    
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
                send_email_replied(user_profile.user_Email, ticket_info.full_Name, ticket_info.ticket_Number)
                ticket = Ticket.objects.get(pk=ticket_Id)
                ticket.ticket_Status = 'Open'
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
    
@api_view(['PUT'])
def adminEditTicket(request, ticket_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})
    
    if request.method == "PUT":
        ticket = Ticket.objects.get(pk=ticket_Id)

        # Get Admins Email
        getAdmins = AdminProfile.objects.filter(admin_Office=ticket.ticket_Office).values_list('admin_Email', flat=True)
        print("Admin Emails:", getAdmins)  # Print admin emails for debugging
        
        if admin_profile.is_master_admin:
            ticket_Office = request.POST.get('ticket_Office')
            ticket.ticket_Office = ticket_Office
            # If no admins are fetched, don't trigger the email notification
            if getAdmins:
                # Send notification to all admins
                send_assigned_ticket_notification(getAdmins, ticket.ticket_Office, ticket.ticket_Number)
            
        ticket.save()
        
        return Response({"message": "Edit Ticket Successfully"})
    else:
        return Response({"message": "Invalid request method"})
    
@api_view(['GET'])
def adminSortTickets(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})

    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})

    if request.method == "GET":
        # Initialize ticket queryset
        tickets = Ticket.objects.all()

        # If the user is not authenticated or not an admin, return unauthorized response
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({"message": "Not Authenticated"})

        # Filter tickets based on admin privileges
        if admin_profile.is_master_admin:
            # If master admin, fetch all tickets regardless of office
            tickets = tickets.order_by('date_Created')
        else:
            # If not master admin, filter tickets based on their admin office
            tickets = tickets.filter(ticket_Office=admin_profile.admin_Office).order_by('date_Created')

        # Get form field values from the request
        ticket_status = request.GET.get('ticket_status')
        ticket_priority = request.GET.get('ticket_priority')
        ticket_type = request.GET.get('ticket_type')
        ticket_office = request.GET.get('ticket_office')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Additional filters based on form fields
        if ticket_status:
            tickets = tickets.filter(ticket_Status=ticket_status)
        if ticket_priority:
            tickets = tickets.filter(ticket_Priority=ticket_priority)
        if ticket_type:
            tickets = tickets.filter(ticket_Type=ticket_type)
        if ticket_office and ticket_office != 'All':
            tickets = tickets.filter(ticket_Office=ticket_office)
        if start_date and end_date:
            # Convert start_date and end_date to datetime objects
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date() + timedelta(days=1)  # Adjust end date to include all of that day
            # Filter tickets within the date range
            tickets = tickets.filter(date_Created__range=[start_date_obj, end_date_obj])

        # Serialize the filtered tickets
        serializer = TicketSerializer(tickets, many=True)

        # Return JSON response with serialized data
        return Response(serializer.data)
    else:
        return Response({"message": "Get Ticket Error"})
