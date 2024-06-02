from django.http import HttpResponse
from django.template.loader import get_template
from django.views.generic import View
from helpdesk.utils import render_to_pdf
from api.models import TicketRating
from django.db.models import Q
from django.db.models import Count, Sum, Case, When, Value, IntegerField, ExpressionWrapper, F, FloatField

def GeneratePDF(request):
    template = get_template('admin/reports/samplereport.html')

    # Define the rating conversion mapping
    rating_conversion = {
        'Excellent': 5,
        'Satisfied': 4,
        'Good': 3,
        'Fair': 2,
        'Poor': 1
    }

    # Get all distinct office names
    distinct_offices = TicketRating.objects.values('ticket_Office').distinct()

    # Calculate overall rating for each office
    overall_ratings = []
    for office in distinct_offices:
        # Get all ratings for the current office
        ratings = TicketRating.objects.filter(ticket_Office=office['ticket_Office']).values_list('ticket_Rating', flat=True)
        # Calculate total sum of numerical ratings
        total_rating = sum(rating_conversion.get(rating, 0) for rating in ratings)
        # Calculate total count of ratings
        count = ratings.count()
        # Calculate overall rating for the current office
        overall_rating = total_rating / count if count != 0 else 0
        # Append the overall rating to the list
        overall_ratings.append({
            'ticket_Office': office['ticket_Office'],
            'overall_rating': overall_rating
        })

    context = {
        "office_ratings": overall_ratings,
    }
    html = template.render(context)
    pdf = render_to_pdf('admin/reports/samplereport.html', context)
    return HttpResponse(pdf, content_type="application/pdf")