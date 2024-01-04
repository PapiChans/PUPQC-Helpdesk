from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import HousingOptionsSerializer
from api.models import HousingOptions
from django.core.files.storage import FileSystemStorage
import os

@api_view(['POST'])
def adminAddHousingReferrals(request):
    if request.method == "POST" and 'housing_Image' in request.FILES:

        housing_Image = request.FILES['housing_Image']
        housing_Type = request.POST.get('housing_Type')
        housing_Name = request.POST.get('housing_Name')
        housing_Description = request.POST.get('housing_Description')
        housing_Location = request.POST.get('housing_Location')
        housing_Contact = request.POST.get('housing_Contact')

        housing = {
            'housing_Type': housing_Type,
            'housing_Name': housing_Name,
            'housing_Image': housing_Image,
            'housing_Description': housing_Description,
            'housing_Location': housing_Location,
            'housing_Contact': housing_Contact,
        }

        serializer = HousingOptionsSerializer(data=housing)    
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Add Housing Options Successfully"})
        return Response({"message": "Add Housing Options Failed"})
    return Response({"message": "Add Housing Options Error"})

@api_view(['GET'])
def adminGetHousingReferrals(request):
    if request.method == "GET":
        data = HousingOptions.objects.all()
        serializer = HousingOptionsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Housing Error"})

@api_view(['GET'])
def adminGetHousingReferralsInfo(request, housing_Id):
    if request.method == "GET":
        housing = HousingOptions.objects.get(pk=housing_Id)
        serializer = HousingOptionsSerializer(housing)
        return Response(serializer.data)
    return Response({"message": "Get Housing Info Error"})

@api_view(['PUT'])
def adminEditHousingReferrals(request, housing_Id):
    if request.method == "PUT":

        housing_Type = request.POST.get('housing_Type')
        housing_Name = request.POST.get('housing_Name')
        housing_Description = request.POST.get('housing_Description')
        housing_Location = request.POST.get('housing_Location')
        housing_Contact = request.POST.get('housing_Contact')

        housing = HousingOptions.objects.get(pk=housing_Id)
        housing.housing_Type = housing_Type
        housing.housing_Name = housing_Name
        housing.housing_Description = housing_Description
        housing.housing_Location = housing_Location
        housing.housing_Contact = housing_Contact
        housing.save()

        return Response({"message": "Edit Housing Success"})
    return Response({"message": "Edit Housing Error"})

@api_view(['PUT'])
def adminReplaceHousingReferralsImage(request, housing_Id):
    if request.method == "PUT" and 'replace_housing_Image' in request.FILES:

        new_Image = request.FILES['replace_housing_Image']
        
        housing = HousingOptions.objects.get(pk=housing_Id)
        file = housing.housing_Image.path
        if housing.housing_Image is None:
            housing.housing_Image = new_Image
            housing.save()
        if os.path.exists(file):
            os.remove(file)
            housing.housing_Image = new_Image
            housing.save()
        else:
            housing.housing_Image = new_Image
            housing.save()
        return Response({"message": "Replace Housing Image Success"})
    return Response({"message": "Replace Housing Image Error"})

@api_view(['DELETE'])
def adminDeleteHousingReferrals(request, housing_Id):
    if request.method == "DELETE":
        
        housing = HousingOptions.objects.get(pk=housing_Id)
        file = housing.housing_Image.path
        if os.path.exists(file):
            os.remove(file)
        housing.delete()
        return Response({"message": "Delete Housing Success"})
    return Response({"message": "Delete Housing Error"})