from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer, KBFolderSerializer, KBCategorySerializer
from api.models import KBCategory, KBFolder, KBTopic

@api_view(['GET'])
def guestGetKBCategory(request):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            data = KBCategory.objects.all().order_by('category_Number')
            serializer = KBCategorySerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Category Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBCategoryInfo(request, category_Name):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            categ = KBCategory.objects.get(category_Name=category_Name)
            serializer = KBCategorySerializer(categ)
            return Response(serializer.data)
        return Response({"message": "Get Category Info Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBFolder(request, category_Id):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            data = KBFolder.objects.all().filter(category_Id=category_Id).order_by('folder_Number')
            serializer = KBFolderSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Folder Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBFolderInfo(request, folder_Id):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            folder = KBFolder.objects.get(pk=folder_Id)
            serializer = KBFolderSerializer(folder)
            return Response(serializer.data)
        return Response({"message": "Get Folder Info Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBFolderbyName(request, folder_Name):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            folder = KBFolder.objects.get(folder_Name=folder_Name)
            serializer = KBFolderSerializer(folder)
            return Response(serializer.data)
        return Response({"message": "Get Folder Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBTopic(request, folder_Id):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            topics = KBTopic.objects.filter(folder_Id=folder_Id, status="Published").order_by('topic_Name')
            serializer = KBTopicSerializer(topics, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Topics Error"})
    else:
        return Response({"message": "Not Authenticated"})
    
@api_view(['GET'])
def guestGetKBTopicInfo(request, topic_Number):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "GET":
            topic = KBTopic.objects.get(topic_Number=topic_Number)
            serializer = KBTopicSerializer(topic)
            return Response(serializer.data)
        return Response({"message": "Get Topic Info Error"})
    else:
        return Response({"message": "Not Authenticated"})

@api_view(['PUT'])
def guestPUTKBTopicLike(request, topic_Number):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "PUT":
            topic = KBTopic.objects.get(topic_Number=topic_Number)
            topic.likes =  topic.likes+1
            topic.save()
            return Response("Like Topic Success")
        return Response({"message": "Like Topic Error"})
    else:
        return Response({"message": "Not Authenticated"})

@api_view(['PUT'])
def guestPUTKBTopicDislike(request, topic_Number):
    if request.user.is_anonymous or (request.user.is_authenticated and not request.user.is_admin):
        if request.method == "PUT":
            topic = KBTopic.objects.get(topic_Number=topic_Number)
            topic.dislikes =  topic.dislikes + 1
            topic.save()
            return Response("Dislike Topic Success")
        return Response({"message": "Dislike Topic Error"})
    else:
        return Response({"message": "Not Authenticated"})