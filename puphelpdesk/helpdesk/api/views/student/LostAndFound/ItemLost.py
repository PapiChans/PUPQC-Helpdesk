from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LostandFoundSerializer
from api.models import LostandFound
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def studAddLostItem(request):
    if request.method == "POST" and 'item_Image' in request.FILES:

        item_Image = request.FILES['item_Image']
        user_Id = request.POST.get('user_Id')
        item_Owner = request.POST.get('item_Owner')
        item_Name = request.POST.get('item_Name')
        item_Description = request.POST.get('item_Description')
        item_Last_Seen = request.POST.get('item_Last_Seen')
        item_Lost_Date = request.POST.get('item_Lost_Date')
        item_Lost_Time = request.POST.get('item_Lost_Time')

        itemlost = {
            'user_Id': user_Id,
            'item_Owner': item_Owner,
            'item_Image': item_Image,
            'item_Name': item_Name,
            'item_Description': item_Description,
            'item_Last_Seen': item_Last_Seen,
            'item_Lost_Date': item_Lost_Date,
            'item_Lost_Time': item_Lost_Time,
            'item_Status': 'Missing',
        }

        serializer = LostandFoundSerializer(data=itemlost)    
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Lost Item Successfully"})
        return Response({"message": "Add Lost Item Failed"})
    return Response({"message": "Add Lost Item Error"})

@api_view(['GET'])
def studGetLostItem(request):
    if request.method == "GET":
        data = LostandFound.objects.all()
        serializer = LostandFoundSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Lost Item Error"})

@api_view(['GET'])
def studGetLostItemInfo(request, item_Id):
    if request.method == "GET":
        itemlost = LostandFound.objects.get(pk=item_Id)
        serializer = LostandFoundSerializer(itemlost)
        return Response(serializer.data)
    return Response({"message": "Get Lost Item Error"})

@api_view(['PUT'])
def studEditLostItem(request, item_Id):
    if request.method == "PUT":

        item_Name = request.POST.get('item_Name')
        item_Description = request.POST.get('item_Description')
        item_Last_Seen = request.POST.get('item_Last_Seen')
        item_Lost_Date = request.POST.get('item_Lost_Date')
        item_Lost_Time = request.POST.get('item_Lost_Time')

        itemlost = LostandFound.objects.get(pk=item_Id)
        itemlost.item_Name = item_Name
        itemlost.item_Description = item_Description
        itemlost.item_Last_Seen = item_Last_Seen
        itemlost.item_Lost_Date = item_Lost_Date
        itemlost.item_Lost_Time = item_Lost_Time
        itemlost.save()

        return Response({"message": "Edit Lost Item Success"})
    return Response({"message": "Edit Lost Item Error"})

@api_view(['PUT'])
def studReplaceLostItemImage(request, item_Id):
    if request.method == "PUT" and 'replace_item_Image' in request.FILES:

        newItem_Image = request.FILES['replace_item_Image']
        
        itemlost = LostandFound.objects.get(pk=item_Id)
        file = itemlost.item_Image.path
        if itemlost.item_Image is None:
            itemlost.item_Image = newItem_Image
            itemlost.save()
        if os.path.exists(file):
            os.remove(file)
            itemlost.item_Image = newItem_Image
            itemlost.save()
        else:
            itemlost.item_Image = newItem_Image
            itemlost.save()
        return Response({"message": "Replace Lost Item Image Success"})
    return Response({"message": "Replace Lost Item Image Error"})

@api_view(['DELETE'])
def studDeleteLostItem(request, item_Id):
    if request.method == "DELETE":
        
        itemlost = LostandFound.objects.get(pk=item_Id)
        file = itemlost.item_Image.path
        if os.path.exists(file):
            os.remove(file)
        itemlost.delete()

        return Response({"message": "Delete Lost Item Success"})
    return Response({"message": "Delete Lost Item Error"})