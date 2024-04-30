from rest_framework.response import Response
from rest_framework.decorators import api_view
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth, TruncDate, ExtractMonth
from api.models import Feedback, FinancialAndScholarshipGuide, JobPosting, StudentGovernment, Ticket, TicketComment
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
def adminFinancialAidChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                FinancialAndScholarshipGuide.objects
                .values('guide_Type')
                .annotate(count=Count('guide_Type'))
            )

            financialaid_count = sum(item['count'] for item in data if item['guide_Type'] == 'Financial Aid')
            scholarship_count = sum(item['count'] for item in data if item['guide_Type'] == 'Scholarship')

            response_data = [
                {'value': financialaid_count, 'name': 'Financial Aid'},
                {'value': scholarship_count, 'name': 'Scholarship'},
            ]
            return Response(response_data)
        return Response({"message": "Get Financial Aid Chart Error"})

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
def adminStudentGovernmentChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                StudentGovernment.objects
                .values('government_Type')
                .annotate(count=Count('government_Type'))
            )

            election_count = sum(item['count'] for item in data if item['government_Type'] == 'Election')
            membership_count = sum(item['count'] for item in data if item['government_Type'] == 'Membership')

            response_data = [
                {'value': election_count, 'name': 'Election'},
                {'value': membership_count, 'name': 'Membership'},
            ]
            return Response(response_data)
        return Response({"message": "Get Student Government Chart Error"})
    
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

            new_count = sum(item['count'] for item in data if item['ticket_Status'] == 'New')
            open_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Open')
            response_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Response')
            closed_count = sum(item['count'] for item in data if item['ticket_Status'] == 'Closed')

            response_data = [
                {'value': new_count, 'name': 'New'},
                {'value': open_count, 'name': 'Open'},
                {'value': response_count, 'name': 'Response'},
                {'value': closed_count, 'name': 'Closed'},
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

            totalticketdata = Ticket.objects.all()
            ticketcommentcountdata = TicketComment.objects.all()

            new_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'New')
            open_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Open')
            response_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Response')
            closed_count = sum(item['count'] for item in ticketdata if item['ticket_Status'] == 'Closed')
            totalticket_data = totalticketdata.count()
            ticket_comment_count = ticketcommentcountdata.count()

            response_data = {
                "new": new_count,
                "open": open_count,
                "response": response_count,
                "closed": closed_count,
                "totalticket": totalticket_data,
                "totalticketcomment": ticket_comment_count,
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