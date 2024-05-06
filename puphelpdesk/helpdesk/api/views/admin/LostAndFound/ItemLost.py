from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LostandFoundSerializer
from api.models import LostandFound, UserProfile
from django.core.files.storage import FileSystemStorage
import os

# For Searching Query
from django.db.models import Q

# For Email Sending
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_email_as_claim(user_Email, item_Name, item_Owner, item_Description, item_Last_Seen, status):
    if status == 'Claim Verification':
        subject = 'Your Lost Item Report - Claim Verification'
        message_content = 'has been marked as "Claim Verification". Please be informed that the item has been found, but we need you to verify if it belongs to you. Kindly visit the campus to confirm ownership.'
    elif status == 'Found':
        subject = 'Your Lost Item Report - Item Found'
        message_content = 'has been found and confirmed by you. Thank you for verifying the item.'
    item_Description_with_breaks = "</p><p>".join(item_Description.split("\n"))
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
                <p class="paragraph">Dear {item_Owner},</p>
                <p class="paragraph">Your lost item report for <strong>{item_Name}</strong> {message_content}</p>
                <p class="paragraph"><strong>Description:</strong></p>
                <p>{item_Description_with_breaks}</p>
                <p class="paragraph"><strong>Last Seen:</strong> {item_Last_Seen}</p>
                <p class="paragraph">Thank you for your cooperation in reporting the lost item.</p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Helpdesk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(item_Name=item_Name, item_Owner=item_Owner, message_content=message_content, item_Description_with_breaks=item_Description_with_breaks, item_Last_Seen=item_Last_Seen)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [user_Email])
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)



@api_view(['GET'])
def adminGetLostItem(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = LostandFound.objects.all()
            serializer = LostandFoundSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['GET'])
def adminGetLostItemInfo(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            itemlost = LostandFound.objects.get(pk=item_Id)
            serializer = LostandFoundSerializer(itemlost)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsMissing(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Missing'
            itemlost.save()
            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsClaim(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Claim Verification'
            itemlost.save()

            # Get user details
            user_Email = itemlost.user_Id
            #Get User's Email
            getUser = UserProfile.objects.get(user_Id=itemlost.user_Id)

            item_Name = itemlost.item_Name
            item_Owner = itemlost.item_Owner
            item_Description = itemlost.item_Description
            item_Last_Seen = itemlost.item_Last_Seen

            # Send email notification to item owner
            send_email_as_claim(getUser.user_Email, item_Name, item_Owner, item_Description, item_Last_Seen, itemlost.item_Status)
            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsFound(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Found'
            itemlost.save()

            # Get user details
            user_Email = itemlost.user_Id
            #Get User's Email
            getUser = UserProfile.objects.get(user_Id=itemlost.user_Id)

            item_Name = itemlost.item_Name
            item_Owner = itemlost.item_Owner
            item_Description = itemlost.item_Description
            item_Last_Seen = itemlost.item_Last_Seen

            # Send email notification to item owner
            send_email_as_claim(getUser.user_Email, item_Name, item_Owner, item_Description, item_Last_Seen, itemlost.item_Status)

            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})

@api_view(['POST'])    
def adminSearchItem(request, item_Keyword):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            item_Keyword = request.POST.get('item_Keyword')
            data = LostandFound.objects.filter(
                Q(item_Owner__icontains=item_Keyword) |
                Q(item_Name__icontains=item_Keyword) |
                Q(item_Description__icontains=item_Keyword) |
                Q(item_Last_Seen__icontains=item_Keyword) |
                Q(item_Lost_Date__icontains=item_Keyword) |
                Q(item_Lost_Time__icontains=item_Keyword)
            ).order_by('date_Created')
            serializer = LostandFoundSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Item Error"})