from rest_framework.response import Response
from rest_framework.decorators import api_view
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth, TruncDate, ExtractMonth
from api.models import Feedback, FinancialAndScholarshipGuide, JobPosting, ServiceReferrals, IDandCard, StudentGovernment, HealthFacility, Ticket
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
def adminServiceReferralChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                ServiceReferrals.objects
                .values('referral_Type')
                .annotate(count=Count('referral_Type'))
            )

            on_campus_count = sum(item['count'] for item in data if item['referral_Type'] == 'On Campus')
            community_count = sum(item['count'] for item in data if item['referral_Type'] == 'Community')

            response_data = [
                {'value': on_campus_count, 'name': 'On Campus'},
                {'value': community_count, 'name': 'Community'},
            ]
            return Response(response_data)
        return Response({"message": "Get Service Referral Chart Error"})

@api_view(['GET'])
def adminIDandCardChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                IDandCard.objects
                .values('guide_Type')
                .annotate(count=Count('guide_Type'))
            )

            obtaining_count = sum(item['count'] for item in data if item['guide_Type'] == 'Obtaining ID')
            replacing_count = sum(item['count'] for item in data if item['guide_Type'] == 'Replacing ID')
            accesscard_count = sum(item['count'] for item in data if item['guide_Type'] == 'Access Card')

            response_data = [
                {'value': obtaining_count, 'name': 'Obtaining ID'},
                {'value': replacing_count, 'name': 'Replacing ID'},
                {'value': accesscard_count, 'name': 'Access Card'},
            ]
            return Response(response_data)
        return Response({"message": "Get Service Referral Chart Error"})

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
def adminHealthFacilityChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = (
                HealthFacility.objects
                .values('health_Facility_Type')
                .annotate(count=Count('health_Facility_Type'))
            )

            health_service_count = sum(item['count'] for item in data if item['health_Facility_Type'] == 'Health Service')
            medical_clinic_count = sum(item['count'] for item in data if item['health_Facility_Type'] == 'Medical Clinic')
            wellness_program_count = sum(item['count'] for item in data if item['health_Facility_Type'] == 'Wellness Program')

            response_data = [
                {'value': health_service_count, 'name': 'Health Service'},
                {'value': medical_clinic_count, 'name': 'Medical Clinic'},
                {'value': wellness_program_count, 'name': 'Wellness Program'},
            ]
            return Response(response_data)
        return Response({"message": "Get Health Facility Chart Error"})


# Tickets

from datetime import datetime, timedelta
from django.db.models.functions import TruncDate, ExtractMonth
from django.db.models import Count

@api_view(['GET'])
def adminTicketChart(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":

            today = datetime.now().date()
            start_of_month = today.replace(day=1)
            next_month = start_of_month.replace(day=28) + timedelta(days=4)
            end_of_month = next_month - timedelta(days=next_month.day)

            start_of_previous_year_month = start_of_month.replace(year=start_of_month.year - 1)
            end_of_previous_year_month = end_of_month.replace(year=end_of_month.year - 1)

            data_current_month = (
                Ticket.objects
                .filter(date_Created__range=[start_of_month, end_of_month])
                .annotate(day=TruncDate('date_Created'))
                .values('day')
                .annotate(count=Count('ticket_Number'))
            )

            total_tickets_current_month = sum(item['count'] for item in data_current_month)

            data_previous_year_month = (
                Ticket.objects
                .filter(date_Created__range=[start_of_previous_year_month, end_of_previous_year_month])
                .annotate(day=TruncDate('date_Created'))
                .values('day')
                .annotate(count=Count('ticket_Number'))
            )
            
            total_tickets_previous_year_month = sum(item['count'] for item in data_previous_year_month)

            response_data = {
                'current_month': total_tickets_current_month,
                'previous_year_same_month': total_tickets_previous_year_month,
            }
        print(response_data)
        return Response(response_data)
        return Response({"message": "Get Ticket Error"})

