from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer, KBFolderSerializer
from api.models import KBFolder, KBTopic
from django.db.models import Max

@api_view(['POST'])
def adminAddKBFolder(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            folder_Name = request.POST.get('folder_Name')
            folder_Description = request.POST.get('folder_Description')

            folder = {
                'folder_Name': folder_Name,
                'folder_Description': folder_Description,
            }
            serializer = KBFolderSerializer(data=folder)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Folder Successfully"})
            return Response({"message": "Add Folder Failed"})
        return Response({"message": "Add Folder Error"})
    
@api_view(['GET'])
def adminGetKBFolder(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = KBFolder.objects.all().order_by('folder_Name')
            serializer = KBFolderSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Folder Error"})
    
@api_view(['GET'])
def adminGetKBFolderInfo(request, folder_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            folder = KBFolder.objects.get(pk=folder_Id)
            serializer = KBFolderSerializer(folder)
            return Response(serializer.data)
        return Response({"message": "Get Folder Info Error"})

@api_view(['PUT'])
def adminEditKBFolder(request, folder_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            folder_Name = request.POST.get('folder_Name')
            folder_Description = request.POST.get('folder_Description')

            folder = KBFolder.objects.get(pk=folder_Id)
            folder.folder_Name = folder_Name
            folder.folder_Description = folder_Description
            folder.save()
            return Response({"message": "Edit Folder Success"})
        return Response({"message": "Edit Folder Error"})
    
@api_view(['DELETE'])
def adminDeleteKBFolder(request, folder_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            if KBTopic.objects.filter(folder_Id=folder_Id).exists():
                return Response({"code": "409", "message": "Conflict: Cannot delete folder with associated topics."})
            else:
                folder = KBFolder.objects.get(pk=folder_Id)
                folder.delete()
                return Response({"code": "200", "message": "Delete Folder Success"})
        return Response({"message": "Delete Folder Error"})