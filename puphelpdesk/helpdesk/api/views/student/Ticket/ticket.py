from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer, FAQSerializer
from api.models import Ticket, TicketComment, FAQ
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def studAddTicket(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            user_Id = request.POST.get('user_Id')
            full_Name = request.POST.get('full_Name')
            ticket_Title = request.POST.get('ticket_Title')
            ticket_Description = request.POST.get('ticket_Description')
            ticket_Number = request.POST.get('ticket_Number')

            ticket = {
                'user_Id': user_Id,
                'full_Name': full_Name,
                'ticket_Title': ticket_Title,
                'ticket_Number': ticket_Number,
                'ticket_Description': ticket_Description,
                'ticket_Status': 'New',
            }
            serializer = TicketSerializer(data=ticket)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Submit Ticket Successfully"})
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

            serializer = TicketCommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()

                ticket = Ticket.objects.get(pk=ticket_Id)
                ticket.ticket_Status = 'Open'
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