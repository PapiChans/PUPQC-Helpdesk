from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import Feedback
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