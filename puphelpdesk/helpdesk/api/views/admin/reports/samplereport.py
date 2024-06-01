from django.http import HttpResponse
from django.template.loader import get_template
from django.views.generic import View
from helpdesk.utils import render_to_pdf
from api.models import AdminProfile
from django.db.models import Q


def GeneratePDF(request):
    template = get_template('admin/reports/samplereport.html')

    context = {
        "records": "ADASDasjkdhkajsdjkashj",
    }
    html = template.render(context)
    pdf = render_to_pdf('admin/reports/samplereport.html', context)
    return HttpResponse(pdf, content_type="application/pdf")