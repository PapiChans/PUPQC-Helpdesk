from rest_framework.response import Response
from rest_framework.decorators import api_view
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth, TruncDate, ExtractMonth
from api.models import Feedback, JobPosting, Ticket, TicketComment
from django.db.models import Count

@api_view(['GET'])
def adminFeedbackVsSuggestions(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                Feedback.objects
                .values('feedback_Type')
                .annotate(count=Count('feedback_Type'))
            )

            feedback_count = sum(item['count'] for item in data if item['feedback_Type'] == 'Feedback')
            suggestion_count = sum(item['count'] for item in data if item['feedback_Type'] == 'Suggestion')

            response_data = [
                {'value': feedback_count, 'name': 'Feedback'},
                {'value': suggestion_count, 'name': 'Suggestion'},
            ]
            return Response(response_data)
        return Response({"message": "Get Feedback Error"})

@api_view(['GET'])
def adminFeedbackChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                Feedback.objects
                .filter(feedback_Type = 'Feedback')
                .values('feedback_Status')
                .annotate(count=Count('feedback_Status'))
            )

            new_count = sum(item['count'] for item in data if item['feedback_Status'] == 'New')
            read_count = sum(item['count'] for item in data if item['feedback_Status'] == 'Read')
            deleted_count = sum(item['count'] for item in data if item['feedback_Status'] == 'Deleted')

            response_data = [
                {'value': new_count, 'name': 'New'},
                {'value': read_count, 'name': 'Read'},
                {'value': deleted_count, 'name': 'Deleted'},
            ]
            return Response(response_data)
        return Response({"message": "Get Feedback Error"})

@api_view(['GET'])
def adminSuggestionChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                Feedback.objects
                .filter(feedback_Type = 'Suggestion')
                .values('feedback_Status')
                .annotate(count=Count('feedback_Status'))
            )

            new_count = sum(item['count'] for item in data if item['feedback_Status'] == 'New')
            read_count = sum(item['count'] for item in data if item['feedback_Status'] == 'Read')
            deleted_count = sum(item['count'] for item in data if item['feedback_Status'] == 'Deleted')

            response_data = [
                {'value': new_count, 'name': 'New'},
                {'value': read_count, 'name': 'Read'},
                {'value': deleted_count, 'name': 'Deleted'},
            ]
            return Response(response_data)
        return Response({"message": "Get Feedback Error"})

@api_view(['GET'])
def adminCareerChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                JobPosting.objects
                .values('job_Posting_Type')
                .annotate(count=Count('job_Posting_Type'))
            )

            job_count = sum(item['count'] for item in data if item['job_Posting_Type'] == 'Job')
            internship_count = sum(item['count'] for item in data if item['job_Posting_Type'] == 'Internship')

            response_data = [
                {'value': job_count, 'name': 'Job'},
                {'value': internship_count, 'name': 'Internship'},
            ]
            return Response(response_data)
        return Response({"message": "Get Career Chart Error"})
    
@api_view(['GET'])
def adminTicketStatusChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                Ticket.objects
                .values('ticket_Status')
                .annotate(count=Count('ticket_Status'))
            )

            pending_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Pending')
            open_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Open')
            resolved_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Resolved')

            response_data = [
                {'value': pending_count, 'name': 'Pending'},
                {'value': open_count, 'name': 'Open'},
                {'value': resolved_count, 'name': 'Resolved'},
            ]
            return Response(response_data)
        return Response({"message": "Get Ticket Chart Error"})
    
@api_view(['GET'])
def adminGetTicketCount(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            ticketdata = (
                Ticket.objects
                .values('ticket_Status')
                .annotate(count=Count('ticket_Status'))
            )

            alldata = Ticket.objects.all()

            pending_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Pending')
            open_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Open')
            resolved_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Resolved')
            totalticket_data = alldata.count()

            response_data = {
                "pending": pending_count,
                "open": open_count,
                "resolved": resolved_count,
                "totalticket": totalticket_data,
            }
            return Response(response_data)
        return Response({"message": "Get Ticket Count Error"})
    
@api_view(['GET'])
def adminGetFeedbacksCount(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            feedbackdata = (
                Feedback.objects
                .values('feedback_Type', 'feedback_Status')
                .annotate(count=Count('feedback_Type'))
            )

            # Counting total number of feedback type 'Feedback'
            total_feedback_count = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Feedback')
            total_suggestion_count = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Suggestion')

            new_feedback = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Feedback' and item['feedback_Status'] == 'New')
            read_feedback = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Feedback' and item['feedback_Status'] == 'Read')
            deleted_feedback = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Feedback' and item['feedback_Status'] == 'Deleted')

            new_suggestion = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Suggestion' and item['feedback_Status'] == 'New')
            read_suggestion = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Suggestion' and item['feedback_Status'] == 'Read')
            deleted_suggestion = sum(item['count'] for item in feedbackdata if item['feedback_Type'] == 'Suggestion' and item['feedback_Status'] == 'Deleted')

            response_data = {
                "total_feedback": total_feedback_count,
                "total_suggestion": total_suggestion_count,
                "new_feedback": new_feedback,
                "read_feedback": read_feedback,
                "deleted_feedback": deleted_feedback,
                "new_suggestion": new_suggestion,
                "read_suggestion": read_suggestion,
                "deleted_suggestion": deleted_suggestion,
            }
            return Response(response_data)
        return Response({"message": "Get Feedback Count Error"})