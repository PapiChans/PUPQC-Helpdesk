from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ServiceReferralsSerializer
from api.models import ServiceReferrals

@api_view(['POST'])
def adminAddServiceReferral(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            referral_Type = request.POST.get('referral_Type')
            referral_Name = request.POST.get('referral_Name')
            referral_Description = request.POST.get('referral_Description')
            referral_More_Info = request.POST.get('referral_More_Info')

            referral = {
                'referral_Type': referral_Type,
                'referral_Name': referral_Name,
                'referral_Description': referral_Description,
                'referral_More_Info': referral_More_Info,
            }
            serializer = ServiceReferralsSerializer(data=referral)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add Service Referrals Successfully"})
            return Response({"message": "Add Service Referrals Failed"})
        return Response({"message": "Add Service Referrals Error"})

@api_view(['GET'])
def adminGetServiceReferral(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = ServiceReferrals.objects.all()
            serializer = ServiceReferralsSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Service Refferals Error"})

@api_view(['GET'])
def adminGetServiceReferralInfo(request, referral_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            service = ServiceReferrals.objects.get(pk=referral_Id)
            serializer = ServiceReferralsSerializer(service)
            return Response(serializer.data)
        return Response({"message": "Get Referral Info Error"})

@api_view(['PUT'])
def adminEditServiceReferral(request, referral_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            referral_Type = request.POST.get('referral_Type')
            referral_Name = request.POST.get('referral_Name')
            referral_Description = request.POST.get('referral_Description')
            referral_More_Info = request.POST.get('referral_More_Info')

            referral = ServiceReferrals.objects.get(pk=referral_Id)
            referral.referral_Type = referral_Type
            referral.referral_Name = referral_Name
            referral.referral_Description = referral_Description
            referral.referral_More_Info = referral_More_Info
            referral.save()
            return Response({"message": "Edit Service Referral Success"})
        return Response({"message": "Edit Service Referral Error"})

@api_view(['DELETE'])
def adminDeleteServiceReferral(request, referral_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            service = ServiceReferrals.objects.get(pk=referral_Id)
            service.delete()
            return Response({"message": "Delete Service Referral Success"})
        return Response({"message": "Delete Service Referral Error"})