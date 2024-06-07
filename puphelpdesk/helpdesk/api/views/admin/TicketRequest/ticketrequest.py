from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import RequestSerializer, RequestCommentSerializer, AuditTrailSerializer
from api.models import Request, RequestComment, UserProfile, User, AdminProfile, AuditTrail
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

User = get_user_model()

def send_assigned_request_notification(admin_Emails, admin_Office, request_Number):
    subject = 'New Request'
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
                <p class="paragraph">A new request has been assigned to your office.</p>
                <p class="paragraph"><strong>Request Number:</strong> <span style="font-size: 20px;">{request_Number}</span></p>
                <p class="paragraph">Please review the request and take appropriate action.</p>
                <p class="paragraph"><strong class="app-team">Best regards,<br>PUPQC Student Help Desk Administrator</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
""".format(admin_Office=admin_Office, request_Number=request_Number)

    # Create EmailMultiAlternatives object to include both HTML and plain text content
    msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, admin_Emails)
    msg.attach_alternative(html_content, "text/html")
    # Send the email
    msg.send(fail_silently=True)

@api_view(['POST'])
def adminAddTicketRequest(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})

    if request.method == "POST":
        try:
            today = timezone.now().date()
            request_count_today = Request.objects.filter(date_Created__date=today).count() + 1
            request_Number = f'R{today.strftime("%Y%m%d")}-{str(request_count_today).zfill(3)}'

            user_Id = request.data.get('user_Id')
            full_Name = request.data.get('full_Name')
            request_Type = request.data.get('request_Type')
            request_Office = request.data.get('request_Office')
            request_Service = request.data.get('request_Service')
            request_Title = request.data.get('request_Title')
            comment_Text = request.data.get('comment_Text')
            comment_Attachment = request.data.get('comment_Attachment')

            if 'comment_Attachment' in request.FILES:
                comment_Attachment = request.FILES['comment_Attachment']
            else:
                comment_Attachment = None

            request_data = {
                'user_Id': user_Id,
                'full_Name': full_Name,
                'request_Type': request_Type,
                'request_Number': request_Number,
                'request_Status': 'Pending',
                'request_Title': request_Title,
                'request_Office': request_Office,
                'request_Service': request_Service,
            }
            request_serializer = RequestSerializer(data=request_data)
            if request_serializer.is_valid():
                request_instance = request_serializer.save()

                comment_data = {
                    'user_Id': user_Id,
                    'full_Name': full_Name,
                    'request_Id': request_instance.request_Id,
                    'comment_Text': comment_Text,
                    'comment_Attachment': comment_Attachment,
                }
                comment_serializer = RequestCommentSerializer(data=comment_data)
                if comment_serializer.is_valid():
                    comment_serializer.save()
                    addRequestTicketaudit(request_Number, full_Name)
                    # Get Admins Email
                    getAdmins = AdminProfile.objects.filter(admin_Office=request_Office).values_list('admin_Email', flat=True)
                    print("Admin Emails:", getAdmins)  # Print admin emails for debugging

                    # If no admins are fetched, don't trigger the email notification
                    if getAdmins:
                        # Send notification to all admins
                        send_assigned_request_notification(getAdmins, request_Office, request_Number)
                    return Response({"message": "Request submitted successfully"})
                else:
                    print("Comment serializer errors:", comment_serializer.errors)
                    return Response({"message": "Submit Request Failed"})

            else:
                print("Request serializer errors:", request_serializer.errors)
                return Response({"message": "Submit Request Failed"})

        except Exception as e:
            print("Error:", e)  
            return Response({"message": "Submit Request Error"})

    return Response({"message": "Submit Request Error"})
    
@api_view(['GET'])
def adminGetMNRequest(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})
    
    if request.method == "GET":
        if admin_profile.is_master_admin or admin_profile.is_technician:
            requests = Request.objects.all().order_by('date_Created').exclude(user_Id=admin_profile.user_Id)
        else:
            requests = Request.objects.all().filter(request_Office=admin_profile.admin_Office).exclude(user_Id=admin_profile.user_Id).order_by('date_Created')

        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    else:
        return Response({"message": "Invalid request method"})
    
def addRequestTicketaudit(request_Number, full_Name):

    audit_data = {
        'audit_Reference': request_Number,
        'audit_User': full_Name,
        'audit_Action': "Created",
        'audit_Description': f"Request {request_Number} has been created."
    }
    serializer = AuditTrailSerializer(data=audit_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Add Trail Successfully"})
    
    return Response({"message": "Invalid data for audit trail"})

@api_view(['GET'])
def adminGetMYRequest(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})
    
    if request.method == "GET":
        requests = Request.objects.filter(user_Id=request.user.user_Id)
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    else:
        return Response({"message": "Invalid request method"})
    
@api_view(['GET'])
def adminSortRequest(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})

    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return Response({"message": "Admin profile not found"})

    if request.method == "GET":
        # Initialize request queryset
        requests = Request.objects.all()

        # If the user is not authenticated or not an admin, return unauthorized response
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({"message": "Not Authenticated"})

        # Filter requests based on admin privileges
        if admin_profile.is_master_admin or admin_profile.is_technician:
            # If master admin, fetch all requests regardless of office
            requests = requests.order_by('date_Created')
        else:
            # If not master admin, filter requests based on their admin office
            requests = requests.filter(request_Office=admin_profile.admin_Office).order_by('date_Created')

        # Get form field values from the request
        request_status = request.GET.get('request_status')
        request_type = request.GET.get('request_type')
        request_office = request.GET.get('request_office')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Additional filters based on form fields
        if request_status:
            requests = requests.filter(request_Status=request_status)
        if request_type:
            requests = requests.filter(request_Type=request_type)
        if request_office and request_office != 'All':
            requests = requests.filter(request_Office=request_office)
        if start_date and end_date:
            # Convert start_date and end_date to datetime objects
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date() + timedelta(days=1)  # Adjust end date to include all of that day
            # Filter requests within the date range
            requests = requests.filter(date_Created__range=[start_date_obj, end_date_obj])

        # Serialize the filtered requests
        serializer = RequestSerializer(requests, many=True)

        # Return JSON response with serialized data
        return Response(serializer.data)
    else:
        return Response({"message": "Get Request Error"})

@api_view(['GET'])
def adminGetRequestInfo(request, request_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Request.objects.get(request_Number=request_Number)
            serializer = RequestSerializer(data)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})

@api_view(['GET'])
def adminGetRequestComment(request, request_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = RequestComment.objects.all().filter(request_Id=request_Id).order_by('date_Created')
            serializer = RequestCommentSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})
    
@api_view(['POST'])
def adminAddRequestComment(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            request_user_Id = request.POST.get('user_Id')
            request_full_Name = request.POST.get('full_Name')
            request_request_Id = request.POST.get('request_Id')
            comment_Text = request.POST.get('comment_Text')

            # Check if 'comment_Attachment' is in request.FILES
            if 'comment_Attachment' in request.FILES:
                comment_Attachment = request.FILES['comment_Attachment']
            else:
                comment_Attachment = None

            comment = {
                'user_Id': request_user_Id,
                'full_Name': request_full_Name,
                'request_Id': request_request_Id,
                'comment_Text': comment_Text,
                'comment_Attachment': comment_Attachment,
            }

            # Get the Request object
            request_info = Request.objects.get(request_Id=request_request_Id)
            
            # Retrieve the associated UserProfile object directly using the user_Id (which is a UUID)
            admin_profile = AdminProfile.objects.get(user_Id=request_info.user_Id)

            serializer = RequestCommentSerializer(data=comment)
            if serializer.is_valid():
                serializer.save()

                print (request_full_Name)
                print (request_info.full_Name)
                if request_info.full_Name != request_full_Name:
                    request_info.request_Status = 'Open'
                    request_info.save()
                addRepliedRequestaudit(request_info.request_Number, request_full_Name)
                # Here you can perform additional actions if needed
                return Response({"message": "Add Comment Successfully"})
            return Response({"message": "Add Comment Failed"})

        return Response({"message": "Add Comment Error"})
    
def addRepliedRequestaudit(request_Number, full_Name):

    audit_data = {
        'audit_Reference': request_Number,
        'audit_User': full_Name,
        'audit_Action': "Replied",
        'audit_Description': f"Request {request_Number} has been replied."
    }
    serializer = AuditTrailSerializer(data=audit_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Add Trail Successfully"})
    
@api_view(['PUT'])
def adminSubmitRequestRating(request, request_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            request_Rating = request.POST.get('request_Rating')

            data = Request.objects.get(request_Number=request_Number)
            data.request_Rating = request_Rating
            data.resolved_Date = timezone.now().isoformat()
            data.request_Status = 'Resolved'
            data.save()
            addResolvedRequestaudit(data.request_Number, data.full_Name)
        return Response({"message": "Get Ticket Error"})
    
def addResolvedRequestaudit(request_Number, full_Name):

    audit_data = {
        'audit_Reference': request_Number,
        'audit_User': full_Name,
        'audit_Action': "Resolved and Rated",
        'audit_Description': f"Request {request_Number} has been resolved and rated."
    }
    serializer = AuditTrailSerializer(data=audit_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Add Trail Successfully"})
    
@api_view(['DELETE'])
def adminCloseRequest(request, request_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            request_obj = Request.objects.get(pk=request_Id)
            # Retrieve the associated UserProfile object directly using the user_Id (which is a UUID)
            admin = AdminProfile.objects.get(user_Id=request.user.user_Id)
            request_obj.request_Status = 'Closed'
            request_obj.save()

            adminCloseRequestaudit(request_obj.request_Number, admin.admin_Last_Name +', '+ admin.admin_First_Name)
            return Response({"message": "Close Request Successfully"})
        return Response({"message": "Close Request Failed"})
    
def adminCloseRequestaudit(request_Number, full_Name):

    audit_data = {
        'audit_Reference': request_Number,
        'audit_User': full_Name,
        'audit_Action': "Closed",
        'audit_Description': f"Request {request_Number} has been closed."
    }
    serializer = AuditTrailSerializer(data=audit_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Add Trail Successfully"})