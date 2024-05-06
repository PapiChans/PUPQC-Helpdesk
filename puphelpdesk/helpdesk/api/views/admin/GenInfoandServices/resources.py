from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ResourcesSerializer
from api.models import Resources
from django.core.files.storage import FileSystemStorage
import os

#Cloudinary Storage
import cloudinary
import cloudinary.uploader
import cloudinary.api

@api_view(['POST'])
def adminAddCampusResources(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST" and 'resources_File' in request.FILES:
            resources_File = request.FILES['resources_File']
            resources_Name = request.POST.get('resources_Name')

            try:
                print("Received file:", resources_File.name)
                print("File size:", resources_File.size)
                print("File content type:", resources_File.content_type)

                # Upload the file to Cloudinary
                print("Uploading file to Cloudinary...")
                upload_result = cloudinary.uploader.upload(resources_File, resource_type="raw")
                print("Upload successful.")

                # Create the resources object with the Cloudinary URL
                resources = {
                    'resources_Name': resources_Name,
                    'resources_File': upload_result['secure_url']  # Use the Cloudinary URL as the file path
                }

                serializer = ResourcesSerializer(data=resources)    
                if serializer.is_valid():
                    serializer.save()
                    print("Resources saved to the database.")
                    return Response({"message": "Add Resources Successfully"})
                else:
                    print("Validation failed:", serializer.errors)
                    return Response({"message": "Add Resources Failed", "errors": serializer.errors})
            except Exception as e:
                print("An error occurred during upload:", str(e))
                return Response({"message": "Upload Failed", "error": str(e)})

        print("Invalid request or missing file.")
        return Response({"message": "Add Resources Error"})

@api_view(['GET'])
def adminGetCampusResources(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = Resources.objects.all()
            serializer = ResourcesSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Resources Error"})

@api_view(['DELETE'])
def adminDeleteCampusResources(request, resources_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    
    if request.method == "DELETE":
        try:
            resources = Resources.objects.get(pk=resources_Id)
            
            # Delete the associated file if it exists
            if resources.resources_File:
                public_ids = [resources.resources_File.name]  # Assuming resources_File stores the Cloudinary public ID
                file_delete_result = cloudinary.api.delete_resources(public_ids, resource_type="raw")
                print("Cloudinary delete result:", file_delete_result)
                
            # Delete the resources object
            resources.delete()

            return Response({"message": "Delete Resources Success"})
        except Resources.DoesNotExist:
            return Response({"message": "Resources not found"})
        except Exception as e:
            print("An error occurred:", str(e))
            return Response({"message": "Delete Resources Error"})
    
    return Response({"message": "Invalid request method"})
