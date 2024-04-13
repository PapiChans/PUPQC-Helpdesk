from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer
from api.models import Ticket, TicketComment
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def adminGetOpenTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='Open').order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetResponseTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='Response').order_by('date_Created')
            serializer = TicketSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['GET'])
def adminGetNewTicket(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Ticket.objects.all().filter(ticket_Status='New').order_by('date_Created')
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

            serializer = TicketCommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()

                ticket = Ticket.objects.get(pk=ticket_Id)
                ticket.ticket_Status = 'Response'
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
            ticket.ticket_Status = 'Closed'
            ticket.save()
            return Response({"message": "Close Ticket Successfully"})
        return Response({"message": "Close Ticket Failed"})