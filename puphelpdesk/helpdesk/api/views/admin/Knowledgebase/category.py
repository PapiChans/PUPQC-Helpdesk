from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import KBTopicSerializer, KBFolderSerializer, KBCategorySerializer
from api.models import KBCategory, KBFolder, KBTopic
from django.db.models import Max

# ----------------
# Knowledgebase Category
# ----------------
@api_view(['POST'])
def adminAddKBCategory(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            category_Name = request.POST.get('category_Name')

            # Find the maximum category number
            max_category_number = KBCategory.objects.aggregate(Max('category_Number'))['category_Number__max']
            next_category_number = 1 if max_category_number is None else max_category_number + 1

            categ = {
                'category_Number': next_category_number,
                'category_Name': category_Name,
            }
            serializer = KBCategorySerializer(data=categ)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Category Successfully"})
            return Response({"message": "Add Category Failed"})
        return Response({"message": "Add Category Error"})
    
@api_view(['GET'])
def adminGetKBCategory(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = KBCategory.objects.all().order_by('category_Number')
            serializer = KBCategorySerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Category Error"})
    
@api_view(['GET'])
def adminGetKBCategoryInfo(request, category_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            categ = KBCategory.objects.get(pk=category_Id)
            serializer = KBCategorySerializer(categ)
            return Response(serializer.data)
        return Response({"message": "Get Category Info Error"})

@api_view(['PUT'])
def adminEditKBCategory(request, category_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            category_Name = request.POST.get('category_Name')

            categ = KBCategory.objects.get(pk=category_Id)
            categ.category_Name = category_Name
            categ.save()
            return Response({"message": "Edit Category Success"})
        return Response({"message": "Edit Category Error"})
    
@api_view(['DELETE'])
def adminDeleteKBCategory(request, category_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            if KBFolder.objects.filter(category_Id=category_Id).exists():
                return Response({"code": "409", "message": "Cannot delete category with associated folders exist."})
            else:
                categ = KBCategory.objects.get(pk=category_Id)
                categ.delete()

                # Renumber remaining categories
                categories = KBCategory.objects.all().order_by('category_Number')
                for index, category in enumerate(categories, start=1):
                    KBCategory.objects.filter(pk=category.pk).update(category_Number=index)
                return Response({"code": "200", "message": "Delete Category Success"})
        return Response({"message": "Delete Category Error"})