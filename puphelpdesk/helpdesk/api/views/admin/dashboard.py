from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import Feedback, FinancialAndScholarshipGuide, JobPosting, ServiceReferrals, IDandCard, StudentGovernment
from django.db.models import Count

@api_view(['GET'])
def adminFeedbackVsSuggestions(request):
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