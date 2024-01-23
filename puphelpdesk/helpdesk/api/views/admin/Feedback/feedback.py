from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FeedbackSerializer
from api.models import Feedback

@api_view(['GET'])
def adminGetNewFeedback(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Feedback.objects.all().filter(feedback_Type = 'Feedback', feedback_Status = 'New')
            serializer = FeedbackSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Feedbacks Error"})

@api_view(['GET'])
def adminGetReadFeedback(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Feedback.objects.all().filter(feedback_Type = 'Feedback', feedback_Status = 'Read')
            serializer = FeedbackSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Feedbacks Error"})

@api_view(['GET'])
def adminGetFeedbackInfo(request, feedback_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            feedback = Feedback.objects.get(pk=feedback_Id)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data)
        return Response({"message": "Get Feedback Info Error"})

@api_view(['PUT'])
def adminFeedbackMarkAsRead(request, feedback_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            feedback = Feedback.objects.get(pk=feedback_Id)
            if feedback.feedback_Status == 'New':
                feedback.feedback_Status = 'Read'
                feedback.save()
                return Response({"message": "Feedback mark as read Success"})
            else:
                return Response({"message": "Feedback mark as read already"})
        return Response({"message": "Feedback marking Error"})

@api_view(['DELETE'])
def adminDeleteFeedback(request, feedback_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            feedback = Feedback.objects.get(pk=feedback_Id)
            feedback.feedback_Status = 'Deleted'
            feedback.save()
            return Response({"message": "Delete Feedback Success"})
        return Response({"message": "Delete Feedback Error"})