from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import ServiceReferralsSerializer
from api.models import ServiceReferrals

@api_view(['GET'])
def studGetServiceReferral(request):
    if request.method == "GET":
        data = ServiceReferrals.objects.all()
        serializer = ServiceReferralsSerializer(data, many=True)
        return Response(serializer.data)
    return Response({"message": "Get Service Refferals Error"})

@api_view(['GET'])
def studGetServiceReferralInfo(request, referral_Id):
    if request.method == "GET":
        service = ServiceReferrals.objects.get(pk=referral_Id)
        serializer = ServiceReferralsSerializer(service)
        return Response(serializer.data)
    return Response({"message": "Get Referral Info Error"})