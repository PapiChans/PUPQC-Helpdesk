from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FeedbackSerializer
from api.models import Feedback

@api_view(['POST'])
def studSubmitFeedback(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":
            user_Id = request.POST.get('user_Id')
            student_Name = request.POST.get('student_Name')
            feedback_Type = request.POST.get('feedback_Type')
            feedback_Text = request.POST.get('feedback_Text')

            feedback = {
                'user_Id': user_Id,
                'student_Id': request.user.username,
                'student_Name': student_Name,
                'feedback_Type': feedback_Type,
                'feedback_Text': feedback_Text,
                'feedback_Status': 'New',
            }
            serializer = FeedbackSerializer(data=feedback)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Submit Feedback Successfully"})
            return Response({"message": "Submit Feedback Failed"})
        return Response({"message": "Submit Feedback Error"})

@api_view(['GET'])
def studGetFeedback(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Feedback.objects.all().filter(user_Id=request.user.user_Id).exclude(feedback_Status='Deleted')
            serializer = FeedbackSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Feedbacks Error"})

@api_view(['GET'])
def studGetFeedbackInfo(request, feedback_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            feedback = Feedback.objects.get(pk=feedback_Id)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data)
        return Response({"message": "Get Feedback Info Error"})

@api_view(['DELETE'])
def studDeleteFeedback(request, feedback_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            feedback = Feedback.objects.get(pk=feedback_Id)
            feedback.feedback_Status = 'Deleted'
            feedback.save()
            return Response({"message": "Delete Feedback Success"})
        return Response({"message": "Delete Feedback Error"})