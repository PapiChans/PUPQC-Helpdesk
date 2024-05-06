from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LostandFoundSerializer
from api.models import LostandFound
from django.core.files.storage import FileSystemStorage
import os

#Cloudinary Storage
import cloudinary
import cloudinary.uploader
import cloudinary.api

@api_view(['POST'])
def studAddLostItem(request):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
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
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = LostandFound.objects.all().filter(user_Id=request.user.user_Id)
            serializer = LostandFoundSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['GET'])
def studGetLostItemInfo(request, item_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            itemlost = LostandFound.objects.get(pk=item_Id)
            serializer = LostandFoundSerializer(itemlost)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['PUT'])
def studEditLostItem(request, item_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
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
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        try:
            if request.method == "PUT" and 'replace_item_Image' in request.FILES:
                newItem_Image = request.FILES['replace_item_Image']
                itemlost = LostandFound.objects.get(pk=item_Id)

                # Delete the existing image from Cloudinary if it exists
                if itemlost.item_Image:
                    public_ids = [itemlost.item_Image.name]  # Assuming item_Image stores the Cloudinary public ID
                    image_delete_result = cloudinary.api.delete_resources(public_ids, resource_type="image")
                    print("Cloudinary delete result:", image_delete_result)

                # Set and save the new image
                itemlost.item_Image = newItem_Image
                itemlost.save()

                return Response({"message": "Replace Lost Item Image Success"})
            else:
                return Response({"message": "No image provided for replacement"})
        except LostandFound.DoesNotExist:
            return Response({"message": "Lost Item does not exist"})
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"})


@api_view(['DELETE'])
def studDeleteLostItem(request, item_Id):
    if request.user.is_anonymous or request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        try:
            if request.method == "DELETE":
                itemlost = LostandFound.objects.get(pk=item_Id)

                # Delete the image from Cloudinary if it exists
                if itemlost.item_Image:
                    public_ids = [itemlost.item_Image.name]  # Assuming item_Image stores the Cloudinary public ID
                    image_delete_result = cloudinary.api.delete_resources(public_ids, resource_type="image")
                    print("Cloudinary delete result:", image_delete_result)

                # Delete the lost item
                itemlost.delete()

                return Response({"message": "Delete Lost Item Success"})
            else:
                return Response({"message": "Invalid HTTP method"})
        except LostandFound.DoesNotExist:
            return Response({"message": "Lost Item does not exist"})
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"})
