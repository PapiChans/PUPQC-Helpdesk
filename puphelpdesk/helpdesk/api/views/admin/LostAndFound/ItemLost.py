from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import LostandFoundSerializer
from api.models import LostandFound
from django.core.files.storage import FileSystemStorage
import os

@api_view(['GET'])
def adminGetLostItem(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = LostandFound.objects.all()
            serializer = LostandFoundSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['GET'])
def adminGetLostItemInfo(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            itemlost = LostandFound.objects.get(pk=item_Id)
            serializer = LostandFoundSerializer(itemlost)
            return Response(serializer.data)
        return Response({"message": "Get Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsMissing(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Missing'
            itemlost.save()
            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsClaim(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Claim Verification'
            itemlost.save()
            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})

@api_view(['PUT'])
def adminItemMarkAsFound(request, item_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":
            itemlost = LostandFound.objects.get(pk=item_Id)
            itemlost.item_Status = 'Found'
            itemlost.save()
            return Response({"message": "Edit Lost Item Success"})
        return Response({"message": "Edit Lost Item Error"})