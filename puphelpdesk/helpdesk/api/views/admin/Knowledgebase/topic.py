from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer
from api.models import KBTopic, KBFolder
import random
import string
from django.utils import timezone

@api_view(['POST'])
def adminAddKBTopic(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            topic_Name = request.POST.get('topic_Name')
            topic_Content = request.POST.get('topic_Content')
            folder_Id = request.POST.get('folder_Id')
            status = request.POST.get('status')
            created_by = request.POST.get('created_by')

            # Generate unique 8-digit random number for topic_Number
            topic_Number = generate_unique_topic_number()

            topic = {
                'topic_Name': topic_Name,
                'topic_Number': topic_Number,
                'topic_Content': topic_Content,
                'folder_Id': folder_Id,
                'status': status,
                'likes': 0,
                'dislikes': 0,
                'created_by': created_by,
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
            topics = KBTopic.objects.filter(folder_Id=folder_Id).order_by('topic_Name')
            serializer = KBTopicSerializer(topics, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Topics Error"})

@api_view(['GET'])
def adminGetKBTopicInfo(request, topic_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            topic = KBTopic.objects.get(topic_Number=topic_Number)
            serializer = KBTopicSerializer(topic)
            return Response(serializer.data)
        return Response({"message": "Get Topic Info Error"})

@api_view(['PUT'])
def adminEditKBTopic(request, topic_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    if request.method == "PUT":
        try:
            topic = KBTopic.objects.get(topic_Number=topic_Number)

            topic_Name = request.data.get('topic_Name')
            topic_Content = request.data.get('topic_Content')
            status = request.data.get('status')
            folder_Id = request.data.get('folder_Id')

            if folder_Id:
                try:
                    folder = KBFolder.objects.get(folder_Id=folder_Id)
                    topic.folder_Id = folder
                except KBFolder.DoesNotExist:
                    return Response({"message": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

            topic.topic_Name = topic_Name
            topic.topic_Content = topic_Content
            topic.status = status
            topic.last_modified = timezone.now()
            topic.save()
            return Response({"message": "Edit Topic Success"})

        except KBTopic.DoesNotExist:
            return Response({"message": "Topic not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"message": "Edit Topic Error"})

@api_view(['DELETE'])
def adminDeleteKBTopic(request, topic_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            topic = KBTopic.objects.get(topic_Number=topic_Number)
            topic.delete()
            return Response({"code": "200", "message": "Delete Topic Success"})
        return Response({"message": "Delete Topic Error"})
