from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import FAQSerializer
from api.models import FAQ

@api_view(['POST'])
def adminAddFAQ(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "POST":

            FAQ_Category = request.POST.get('FAQ_Category')
            FAQ_Question = request.POST.get('FAQ_Question')
            FAQ_Answer = request.POST.get('FAQ_Answer')

            faq = {
                'FAQ_Category': FAQ_Category,
                'FAQ_Question': FAQ_Question,
                'FAQ_Answer': FAQ_Answer,
            }
            serializer = FAQSerializer(data=faq)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Add FAQ Successfully"})
            return Response({"message": "Add FAQ Failed"})
        return Response({"message": "Add FAQ Error"})

@api_view(['GET'])
def adminGetFAQ(request):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            data = FAQ.objects.all().order_by('FAQ_Category')
            serializer = FAQSerializer(data, many=True)
            return Response(serializer.data)
        return Response({"message": "Get FAQ Error"})

@api_view(['GET'])
def adminGetFAQInfo(request, FAQ_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "GET":
            faq = FAQ.objects.get(pk=FAQ_Id)
            serializer = FAQSerializer(faq)
            return Response(serializer.data)
        return Response({"message": "Get FAQ Info Error"})

@api_view(['PUT'])
def adminEditFAQ(request, FAQ_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "PUT":

            FAQ_Category = request.POST.get('FAQ_Category')
            FAQ_Question = request.POST.get('FAQ_Question')
            FAQ_Answer = request.POST.get('FAQ_Answer')

            faq = FAQ.objects.get(pk=FAQ_Id)
            faq.FAQ_Category = FAQ_Category
            faq.FAQ_Question = FAQ_Question
            faq.FAQ_Answer = FAQ_Answer
            faq.save()
            return Response({"message": "Edit FAQ Success"})
        return Response({"message": "Edit FAQ Error"})

@api_view(['DELETE'])
def adminDeleteFAQ(request, FAQ_Id):
    if request.user.is_anonymous or not request.user.is_admin:
        return Response({"message": "Not Authenticated"})
    else:
        if request.method == "DELETE":
            faq = FAQ.objects.get(pk=FAQ_Id)
            faq.delete()
            return Response({"message": "Delete FAQ Success"})
        return Response({"message": "Delete FAQ Error"})