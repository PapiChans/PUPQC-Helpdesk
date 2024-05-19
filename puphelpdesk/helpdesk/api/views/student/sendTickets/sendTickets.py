from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.files.storage import FileSystemStorage
import os
from api.serializers import SendTicketSerializer
from api.models import SendTicket
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

@api_view(['POST'])
def submit_ticket(request):
    if request.method == "POST":
        today = timezone.now().date()

        ticket_count_today = SendTicket.objects.filter(date_Submitted__date=today).count() + 1


        ticket_Number = f'T{today.strftime("%Y%m%d")}-{str(ticket_count_today).zfill(3)}'

        sender_Name = request.POST.get('sender_Name')
        sender_Email = request.POST.get('sender_Email')
        sender_Affiliation = request.POST.get('sender_Affiliation')
        ticket_Type = request.POST.get('ticket_Type')
        Description = request.POST.get('Description')

        ticket_data = {
            'sender_Name': sender_Name,
            'sender_Email': sender_Email,
            'sender_Affiliation': sender_Affiliation,
            'ticket_Type': ticket_Type,
            'Description': Description,
            'ticket_Number': ticket_Number,
            'ticket_Status': 'Open',
        }
        serializer = SendTicketSerializer(data=ticket_data)
        if serializer.is_valid():
            ticket_instance = serializer.save()

            ticket_number = ticket_instance.ticket_Number

            return Response({"message": "Submit Ticket", "ticket_Number": ticket_number})
        else:
            return Response(serializer.errors, status=400)
    return Response({"message": "Invalid Request"}, status=400)
