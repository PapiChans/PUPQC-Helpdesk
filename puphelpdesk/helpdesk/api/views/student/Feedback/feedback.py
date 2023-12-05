from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FeedbackSerializer
from api.models import Feedback

@api_view(['POST'])
def studSubmitFeedback(request):
    if request.method == "POST":
        student_Id = request.POST.get('student_Id')
        student_Name = request.POST.get('student_Name')
        feedback_Type = request.POST.get('feedback_Type')
        feedback_Text = request.POST.get('feedback_Text')

        feedback = {
            'user_Id': '1fa54fda-3593-4fcf-9689-5d293da334be',
            'student_Id': student_Id,
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
    if request.method == "GET":
        data = Feedback.objects.all()
        serializer = FeedbackSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Feedbacks Error"})

@api_view(['GET'])
def studGetFeedbackInfo(request, feedback_Id):
    if request.method == "GET":
        feedback = Feedback.objects.get(pk=feedback_Id)
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)
    return Response({"message": "Get Feedback Info Error"})

@api_view(['DELETE'])
def studDeleteFeedback(request, feedback_Id):
    if request.method == "DELETE":
        feedback = Feedback.objects.get(pk=feedback_Id)
        feedback.delete()
        return Response({"message": "Delete Feedback Success"})
    return Response({"message": "Delete Feedback Error"})