from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FeedbackSerializer
from api.models import Feedback

@api_view(['GET'])
def adminGetNewSuggestion(request):
    if request.method == "GET":
        data = Feedback.objects.all().filter(feedback_Type = 'Suggestion', feedback_Status = 'New')
        serializer = FeedbackSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Suggestions Error"})

@api_view(['GET'])
def adminGetReadSuggestion(request):
    if request.method == "GET":
        data = Feedback.objects.all().filter(feedback_Type = 'Suggestion', feedback_Status = 'Read')
        serializer = FeedbackSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Suggestions Error"})

@api_view(['GET'])
def adminGetSuggestionInfo(request, feedback_Id):
    if request.method == "GET":
        feedback = Feedback.objects.get(pk=feedback_Id)
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)
    return Response({"message": "Get Suggestion Info Error"})

@api_view(['PUT'])
def adminSuggestionMarkAsRead(request, feedback_Id):
    if request.method == "PUT":
        feedback = Feedback.objects.get(pk=feedback_Id)
        if feedback.feedback_Status == 'New':
            feedback.feedback_Status = 'Read'
            feedback.save()
            return Response({"message": "Suggestion mark as read Success"})
        else:
            return Response({"message": "Suggestion mark as read already"})
    return Response({"message": "Suggestion marking Error"})

@api_view(['DELETE'])
def adminDeleteSuggestion(request, feedback_Id):
    if request.method == "DELETE":
        feedback = Feedback.objects.get(pk=feedback_Id)
        feedback.feedback_Status = 'Deleted'
        feedback.save()
        return Response({"message": "Delete Suggestion Success"})
    return Response({"message": "Delete Suggestion Error"})