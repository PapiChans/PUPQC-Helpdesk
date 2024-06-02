from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, AuditTrailSerializer
from api.models import Ticket, AuditTrail

@api_view(['GET'])
def adminGetAuditTrail(request, ticket_Number):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = AuditTrail.objects.filter(audit_Reference=ticket_Number).order_by('-date_Created')
            serializer = AuditTrailSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get Ticket Error"})