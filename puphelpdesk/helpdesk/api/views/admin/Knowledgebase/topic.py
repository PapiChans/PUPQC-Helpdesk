from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer
from api.models import KBTopic
import random
import string

@api_view(['POST'])
def adminAddKBTopic(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            topic_Name = request.POST.get('topic_Name')
            topic_Content = request.POST.get('topic_Content')
            status = request.POST.get('status')
            created_by = request.POST.get('full_Name')

            # Generate unique 8-digit random number for topic_Number
            topic_Number = generate_unique_topic_number()

            topic = {
                'topic_Name': topic_Name,
                'topic_Number': topic_Number,
                'topic_Content': topic_Content,
                'status': status,
                'likes': 0,
                'dislikes': 0,
            }
            serializer = KBTopicSerializer(data=topic)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Topic Successfully"})
            return Response({"message": "Add Topic Failed"})
        return Response({"message": "Add Topic Error"})
    
def generate_unique_topic_number():
    # Generate a random 8-digit number
    random_number = ''.join(random.choices(string.digits, k=8))
    # Check if the number already exists in the database
    while KBTopic.objects.filter(topic_Number=random_number).exists():
        random_number = ''.join(random.choices(string.digits, k=8))

    return random_number

@api_view(['GET'])
def adminGetKBTopic(request, folder_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            topics = KBTopic.objects.filter(folder_Id=folder_Id)
            serializer = KBTopicSerializer(topics, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Topics Error"})

@api_view(['GET'])
def adminGetKBTopicInfo(request, topic_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            topic = KBTopic.objects.get(pk=topic_Id)
            serializer = KBTopicSerializer(topic)
            return Response(serializer.data)
        return Response({"message": "Get Topic Info Error"})

@api_view(['PUT'])
def adminEditKBTopic(request, topic_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            topic_Content = request.POST.get('topic_Content')

            topic = KBTopic.objects.get(pk=topic_Id)
            topic.topic_Content = topic_Content
            topic.save()
            return Response({"message": "Edit Topic Success"})
        return Response({"message": "Edit Topic Error"})

@api_view(['DELETE'])
def adminDeleteKBTopic(request, topic_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            topic = KBTopic.objects.get(pk=topic_Id)
            topic.delete()
            return Response({"code": "200", "message": "Delete Topic Success"})
        return Response({"message": "Delete Topic Error"})
