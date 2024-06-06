from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import TicketSerializer, TicketCommentSerializer, AuditTrailSerializer
from api.models import Ticket, TicketComment, UserProfile, User, AdminProfile, AuditTrail, Evaluation
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

@api_view(['GET'])
def evalVerifyID(request, eval_Id):
    if request.method == "GET":
        try:
            data = Evaluation.objects.get(pk=eval_Id)
            if data.eval_Status != 'Done':
                return Response({"code": 200})
            else:
                return Response({"code": 401})
        except ObjectDoesNotExist:
            return Response({"code": 404})
    return Response({"message": "Get Ticket Error"})

@api_view(['PUT'])
def evalSubmit(request, eval_Id):
    if request.method == "PUT":
        # Get data from request
        eval_Client = request.POST.get('Client')
        eval_Gender = request.POST.get('Gender')
        QA = request.POST.get('satisfaction_A')
        QB = request.POST.get('satisfaction_B')
        QC = request.POST.get('satisfaction_C')
        QD = request.POST.get('satisfaction_D')
        QE = request.POST.get('satisfaction_E')
        QF = request.POST.get('satisfaction_F')
        QG = request.POST.get('satisfaction_G')
        QH = request.POST.get('satisfaction_H')
        remarks = request.POST.get('remarks')

        # print("Evaluation ID:", eval_Id)
        # print("Client:", eval_Client)
        # print("Gender:", eval_Gender)
        # print("QA:", QA)
        # print("QB:", QB)
        # print("QC:", QC)
        # print("QD:", QD)
        # print("QE:", QE)
        # print("QF:", QF)
        # print("QG:", QG)
        # print("QH:", QH)
        # print("Rating:", rating)
        # print("Remarks:", remarks)

        # Get or create Evaluation object
        eval_obj = Evaluation.objects.get(pk=eval_Id)

        # Update Evaluation object with new data
        eval_obj.eval_Client = eval_Client
        eval_obj.eval_Gender = eval_Gender
        eval_obj.QA = QA
        eval_obj.QB = QB
        eval_obj.QC = QC
        eval_obj.QD = QD
        eval_obj.QE = QE
        eval_obj.QF = QF
        eval_obj.QG = QG
        eval_obj.QH = QH
        eval_obj.remarks = remarks
        eval_obj.date_filled = timezone.now()  # Set date filled to current datetime
        eval_obj.eval_Status = 'Done'  # Set evaluation status to 'Done'
        eval_obj.save()

        return Response({"message": "Evaluation submitted successfully"})
    return Response({"message": "Invalid request"})