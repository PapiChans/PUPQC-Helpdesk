from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer, KBFolderSerializer, KBCategorySerializer
from api.models import KBCategory, KBFolder, KBTopic
from django.db.models import Max

@api_view(['POST'])
def adminAddKBFolder(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            folder_Name = request.POST.get('folder_Name')
            category_Id = request.POST.get('category_Id')

            # Find the maximum category number
            max_category_number = KBFolder.objects.aggregate(Max('folder_Number'))['folder_Number__max']
            next_category_number = 1 if max_category_number is None else max_category_number + 1

            folder = {
                'folder_Number': next_category_number,
                'folder_Name': folder_Name,
                'category_Id': category_Id,
            }
            serializer = KBFolderSerializer(data=folder)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Folder Successfully"})
            return Response({"message": "Add Folder Failed"})
        return Response({"message": "Add Folder Error"})
    
@api_view(['GET'])
def adminGetKBFolder(request, category_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = KBFolder.objects.all().filter(category_Id=category_Id).order_by('folder_Number')
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
            category_Id = request.POST.get('category_Id')

            folder = KBFolder.objects.get(pk=folder_Id)
            folder.folder_Name = folder_Name
            # Retrieve the KBCategory instance corresponding to category_Id
            category_instance = KBCategory.objects.get(category_Id=category_Id)
            folder.category_Id = category_instance

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
                return Response({"code": "409", "message": "Conflict: Cannot delete category with associated folders."})
            else:
                folder = KBFolder.objects.get(pk=folder_Id)
                folder.delete()

                # Renumber remaining categories
                categories = KBFolder.objects.all().order_by('folder_Number')
                for index, category in enumerate(categories, start=1):
                    KBFolder.objects.filter(pk=category.pk).update(folder_Number=index)
                return Response({"code": "200", "message": "Delete Folder Success"})
        return Response({"message": "Delete Folder Error"})