from django.http import HttpResponse
from django.template.loader import get_template
from django.views.generic import View
from helpdesk.utils import render_to_pdf
from api.models import AdminProfile, Ticket, TicketRating, Request, Evaluation
from django.db.models import Q, Avg
from django.db.models import Count, Case, When, IntegerField, Value
from django.shortcuts import render, redirect
from datetime import timezone, datetime
from django.db.models import Count, Sum
from django.db.models.functions import Cast
from django.db.models import FloatField

def masteradminMonthlyOfficeTicketReport(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')
    # Fetch the user credentials
    user = request.user
    
    # Fetch the associated admin profile
    try:
        admin_profile = AdminProfile.objects.get(user_Id=user)
    except AdminProfile.DoesNotExist:
        return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
    
    # Check if user is master admin
    if not admin_profile.is_master_admin:
        return render(request, 'HTTPResponse/401.html')
    if request.method == 'GET':
        month_year_str = request.GET.get('date_month')
        if not month_year_str:
            current_month_year = datetime.now()
            month_year_str = current_month_year.strftime('%b %Y')
        
        month_year = datetime.strptime(month_year_str, '%b %Y')

        all_offices = [
            "Director's Office",
            "Academic Office",
            "Student Affairs and Service Office",
            "Registrar's Office",
            "Admission Office",
            "Cash and Disbursing Office",
            "Accounting Office",
            "Quality Assurance Center and OJT Office",
            "IT Laboratory Office",
            "Medical Clinic",
            "Administrative Office",
            "Property Office",
            "Records' Office",
            "Cultural Office",
            "Scholarship Office",
            "Alumni Relations Office",
            "Library Office",
            "Security Office",
            "Records Office (Student)",
            "Records Office (PUP)",
        ]

        ticket_counts = Ticket.objects.filter(date_Created__year=month_year.year, date_Created__month=month_year.month) \
            .values('ticket_Office', 'ticket_Status').annotate(count=Count('ticket_Status'))

        office_data = {office: {'Pending': 0, 'Open': 0, 'Resolved': 0, 'Closed': 0} for office in all_offices}

        for ticket_count in ticket_counts:
            office = ticket_count['ticket_Office']
            status = ticket_count['ticket_Status']
            count = ticket_count['count']
            office_data[office][status] += count

        for office, data in office_data.items():
            data['Total'] = sum(data.values())

        overall_total = sum(data['Total'] for data in office_data.values())

        context = {
            'office_data': office_data,
            'total_tickets': {
                'Pending': sum(data['Pending'] for data in office_data.values()),
                'Open': sum(data['Open'] for data in office_data.values()),
                'Resolved': sum(data['Resolved'] for data in office_data.values()),
                'Closed': sum(data['Closed'] for data in office_data.values()),
                'Overall_Total': overall_total,
            },
            'month_year_str': month_year_str,
        }

        template = get_template('admin/reports/masteradminmonthlyticketreport.html')
        html = template.render(context)
        pdf = render_to_pdf('admin/reports/masteradminmonthlyticketreport.html', context)
        return HttpResponse(pdf, content_type="application/pdf")
    else:
        return render(request, 'admin/reports/reports.html', {'error_message': 'Invalid request method.'})
    
def masteradminMonthlyOfficeTicketRatings(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')
    # Fetch the user credentials
    user = request.user
    
    # Fetch the associated admin profile
    try:
        admin_profile = AdminProfile.objects.get(user_Id=user)
    except AdminProfile.DoesNotExist:
        return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
    
    # Check if user is master admin
    if not admin_profile.is_master_admin:
        return render(request, 'HTTPResponse/401.html')
    if request.method == 'GET':
        month_year_str = request.GET.get('date_month')
        if not month_year_str:
            current_month_year = datetime.now()
            month_year_str = current_month_year.strftime('%b %Y')
        
        month_year = datetime.strptime(month_year_str, '%b %Y')

        # Step 1: Get distinct offices
        all_offices = [
            "Director's Office",
            "Academic Office",
            "Student Affairs and Service Office",
            "Registrar's Office",
            "Admission Office",
            "Cash and Disbursing Office",
            "Accounting Office",
            "Quality Assurance Center and OJT Office",
            "IT Laboratory Office",
            "Medical Clinic",
            "Administrative Office",
            "Property Office",
            "Records' Office",
            "Cultural Office",
            "Scholarship Office",
            "Alumni Relations Office",
            "Library Office",
            "Security Office",
            "Records Office (Student)",
            "Records Office (PUP)",
        ]
        
        office_data = []
        for office in all_offices:
            ratings = TicketRating.objects.filter(ticket_Office=office, date_Created__year=month_year.year, date_Created__month=month_year.month)
            
            # Step 2: Calculate count of each rating
            rating_counts = ratings.values('ticket_Rating').annotate(count=Count('ticket_Rating'))

            # Step 3: Convert rating words to values and calculate the average rating
            total_ratings = ratings.count()
            average_rating = ratings.annotate(
                rating_value=Cast(
                    Case(
                        When(ticket_Rating='Excellent', then=Value(5)),
                        When(ticket_Rating='Good', then=Value(4)),
                        When(ticket_Rating='Average', then=Value(3)),
                        When(ticket_Rating='Fair', then=Value(2)),
                        When(ticket_Rating='Poor', then=Value(1)),
                        output_field=FloatField()
                    ),
                    FloatField()
                )
            ).aggregate(total=Sum('rating_value'))['total'] or 0
            if total_ratings > 0:
                average_rating /= total_ratings

            # Step 4: Determine remarks based on average rating
            if total_ratings > 0:
                if average_rating >= 4.5:
                    remarks = 'Excellent'
                elif average_rating >= 3.5:
                    remarks = 'Good'
                elif average_rating >= 2.5:
                    remarks = 'Average'
                elif average_rating >= 1.5:
                    remarks = 'Fair'
                else:
                    remarks = 'Poor'
            else:
                remarks = 'No rating'

            office_data.append({
                'office_name': office,
                'excellent': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Excellent'), 0),
                'good': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Good'), 0),
                'average': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Average'), 0),
                'fair': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Fair'), 0),
                'poor': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Poor'), 0),
                'average_rating': round(average_rating, 2),
                'remarks': remarks
            })

        context = {
            'month_year_str': month_year_str,
            'office_data': office_data
        }

        template = get_template('admin/reports/masteradminmonthlyratings.html')
        html = template.render(context)
        pdf = render_to_pdf('admin/reports/masteradminmonthlyratings.html', context)
        return HttpResponse(pdf, content_type="application/pdf")
    else:
        return render(request, 'admin/reports/reports.html', {'error_message': 'Invalid request method.'})
    
def masteradminMonthlyOfficeRequestReport(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')
    # Fetch the user credentials
    user = request.user
    
    # Fetch the associated admin profile
    try:
        admin_profile = AdminProfile.objects.get(user_Id=user)
    except AdminProfile.DoesNotExist:
        return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
    
    # Check if user is master admin
    if not admin_profile.is_master_admin:
        return render(request, 'HTTPResponse/401.html')
    if request.method == 'GET':
        month_year_str = request.GET.get('date_month')
        if not month_year_str:
            current_month_year = datetime.now()
            month_year_str = current_month_year.strftime('%b %Y')
        
        month_year = datetime.strptime(month_year_str, '%b %Y')

        all_offices = [
            "Director's Office",
            "Academic Office",
            "Student Affairs and Service Office",
            "Registrar's Office",
            "Admission Office",
            "Cash and Disbursing Office",
            "Accounting Office",
            "Quality Assurance Center and OJT Office",
            "IT Laboratory Office",
            "Medical Clinic",
            "Administrative Office",
            "Property Office",
            "Records' Office",
            "Cultural Office",
            "Scholarship Office",
            "Alumni Relations Office",
            "Library Office",
            "Security Office",
            "Records Office (Student)",
            "Records Office (PUP)",
        ]

        # Step 1: Get distinct offices
        distinct_offices = Request.objects.values('request_Office').distinct()

        # Step 2: Fetch request status counts for each office
        office_data = []
        total_pending = 0
        total_open = 0
        total_resolved = 0
        total_closed = 0
        total_requests = 0
        for office_name in all_offices:
            status_counts = Request.objects.filter(request_Office=office_name, date_Created__year=month_year.year, date_Created__month=month_year.month).values('request_Status').annotate(count=Count('request_Status'))

            # Calculate total requests
            total_requests_office = sum(status['count'] for status in status_counts)

            # Calculate totals for each status
            pending = next((status['count'] for status in status_counts if status['request_Status'] == 'Pending'), 0)
            open = next((status['count'] for status in status_counts if status['request_Status'] == 'Open'), 0)
            resolved = next((status['count'] for status in status_counts if status['request_Status'] == 'Resolved'), 0)
            closed = next((status['count'] for status in status_counts if status['request_Status'] == 'Closed'), 0)

            # Populate data for the first table
            office_data.append({
                'office_name': office_name,
                'pending': pending,
                'open': open,
                'resolved': resolved,
                'closed': closed,
                'total_requests': total_requests_office
            })

            # Update total counts
            total_pending += pending
            total_open += open
            total_resolved += resolved
            total_closed += closed
            total_requests += total_requests_office

        # Append totals to office_data
        office_data.append({
            'office_name': 'Total',
            'pending': total_pending,
            'open': total_open,
            'resolved': total_resolved,
            'closed': total_closed,
            'total_requests': total_requests
        })

        # Step 3: Fetch request ratings for each office
        ratings_data = []
        for office_name in all_offices:
            ratings = Request.objects.filter(request_Office=office_name, date_Created__year=month_year.year, date_Created__month=month_year.month).values_list('request_Rating', flat=True)

            # Filter out None values from ratings and calculate the sum
            total_rating_sum = sum(rating for rating in ratings if rating is not None)

            # Calculate the total number of ratings
            total_ratings = len(ratings)

            # Calculate the average rating
            average_rating = total_rating_sum / total_ratings if total_ratings > 0 else 0

            # Determine remarks
            if total_ratings == 0:
                remarks = 'No rating'
            elif average_rating >= 4.5:
                remarks = 'Excellent'
            elif average_rating >= 3.5:
                remarks = 'Good'
            elif average_rating >= 2.5:
                remarks = 'Average'
            elif average_rating >= 1.5:
                remarks = 'Fair'
            else:
                remarks = 'Poor'

            # Populate data for the second table
            ratings_data.append({
                'office_name': office_name,
                'excellent': ratings.filter(request_Rating=5).count(),
                'good': ratings.filter(request_Rating=4).count(),
                'average': ratings.filter(request_Rating=3).count(),
                'fair': ratings.filter(request_Rating=2).count(),
                'poor': ratings.filter(request_Rating=1).count(),
                'average_rating': round(average_rating, 2),
                'remarks': remarks
            })

        context = {
            'month_year_str': month_year_str,
            'office_data': office_data,
            'ratings_data': ratings_data
        }

        template = get_template('admin/reports/masteradminmonthlyrequestreport.html')
        html = template.render(context)
        pdf = render_to_pdf('admin/reports/masteradminmonthlyrequestreport.html', context)
        return HttpResponse(pdf, content_type="application/pdf")
    else:
        return render(request, 'admin/reports/reports.html', {'error_message': 'Invalid request method.'})

def masteradminMonthlyEvaluationReport(request):
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')
    # Fetch the user credentials
    user = request.user
    
    # Fetch the associated admin profile
    try:
        admin_profile = AdminProfile.objects.get(user_Id=user)
    except AdminProfile.DoesNotExist:
        return render(request, 'HTTPResponse/401.html')  # If admin profile doesn't exist, return 401
    
    # Check if user is master admin
    if not admin_profile.is_master_admin:
        return render(request, 'HTTPResponse/401.html') 
    if request.method == 'GET':
        month_year_str = request.GET.get('date_month')
        if not month_year_str:
            current_month_year = datetime.now()
            month_year_str = current_month_year.strftime('%b %Y')
        
        month_year = datetime.strptime(month_year_str, '%b %Y')

        # First table: Count all the gender from eval_Gender
        gender_counts = Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month) \
                                          .values('eval_Gender') \
                                          .annotate(
                                              Male=Count(Case(When(eval_Gender='Male', then=1))),
                                              Female=Count(Case(When(eval_Gender='Female', then=1))),
                                              Prefer_not_to_say=Count(Case(When(eval_Gender='Prefer not to say', then=1)))
                                          )

        # Second table: Count all the clients from eval_client
        client_counts = Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month) \
            .values('eval_Client') \
            .annotate(count=Count('eval_Client'))

        # Get distinct client types and their counts
        distinct_client_counts = [(item['eval_Client'], item['count']) for item in client_counts]

        # Descriptive question mapping
        question_mapping = {
            'QA': 'A. Responsiveness: The willingness to help, assist, and provide prompt service to citizens/clients',
            'QB': 'B. Reliability(Quality): Provision of what was promised with zero to a minimal error',
            'QC': 'C. Access & Facilities: The convenience of location, ample amenities for comfortable transactions',
            'QD': 'D. Communication: The act of keeping clients informed in a language they can easily understand',
            'QE': 'E. Costs: The satisfaction with timeliness of the billing, billing process/es',
            'QF': 'F. Integrity: Assurance that there is honesty, justice, fairness, and trust in service',
            'QG': 'G. Assurance: The capability of frontline staff to perform their duties',
            'QH': 'H. Outcome: Extent of achieving outcomes or realizing the intended benefits of government services'
        }

        # Third table: Get average ratings for each question and overall ratings
        overall_ratings = []
        for question_label, question_text in question_mapping.items():
            avg_rating = Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month) \
                                           .aggregate(avg_rating=Avg(question_label))['avg_rating'] or 0

            # Determine overall rating
            if avg_rating >= 4.5:
                overall_rating = 'Excellent'
            elif avg_rating >= 3.5:
                overall_rating = 'Good'
            elif avg_rating >= 2.5:
                overall_rating = 'Average'
            elif avg_rating >= 1.5:
                overall_rating = 'Fair'
            else:
                overall_rating = 'Poor'

            overall_ratings.append({
                'question': question_text,
                'excellent_count': Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month, **{question_label + '__gte': 4}).count(),
                'good_count': Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month, **{question_label + '__gte': 3, question_label + '__lt': 4}).count(),
                'average_count': Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month, **{question_label + '__gte': 2, question_label + '__lt': 3}).count(),
                'fair_count': Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month, **{question_label + '__gte': 1, question_label + '__lt': 2}).count(),
                'poor_count': Evaluation.objects.filter(date_filled__year=month_year.year, date_filled__month=month_year.month, **{question_label + '__lt': 1}).count(),
                'average_rating': round(avg_rating, 2),
                'overall_rating': overall_rating
            })

        context = {
            'month_year_str': month_year_str,
            'gender_counts': gender_counts,
            'distinct_client_counts': distinct_client_counts,
            'overall_ratings': overall_ratings
        }

        template = get_template('admin/reports/masteradminevaluationreport.html')
        html = template.render(context)
        pdf = render_to_pdf('admin/reports/masteradminevaluationreport.html', context)
        return HttpResponse(pdf, content_type="application/pdf")
    else:
        return render(request, 'admin/reports/reports.html', {'error_message': 'Invalid request method.'})
    
def adminMonthlyReport(request):
    # Check user authentication and authorization
    if request.user.is_anonymous:
        return redirect('login')
    if not request.user.is_admin:
        return render(request, 'HTTPResponse/401.html')

    # Fetch the user credentials and associated admin profile
    try:
        admin_profile = AdminProfile.objects.get(user_Id=request.user)
    except AdminProfile.DoesNotExist:
        return render(request, 'HTTPResponse/401.html')  

    # Check if the user is a master admin
    if admin_profile.is_master_admin:
        return render(request, 'HTTPResponse/401.html') 
    
    if request.method == 'GET':
        # Get the month and year from the request
        month_year_str = request.GET.get('date_month')
        if not month_year_str:
            current_month_year = datetime.now()
            month_year_str = current_month_year.strftime('%b %Y')
        
        month_year = datetime.strptime(month_year_str, '%b %Y')

        # Fetch ticket counts
        ticket_counts = Ticket.objects.filter(
            date_Created__year=month_year.year, 
            date_Created__month=month_year.month,
            ticket_Office=admin_profile.admin_Office
        ).values('ticket_Office', 'ticket_Status').annotate(count=Count('ticket_Status'))

        # Initialize office data for ticket counts
        office_data = {admin_profile.admin_Office: {'Pending': 0, 'Open': 0, 'Resolved': 0, 'Closed': 0}}

        for ticket_count in ticket_counts:
            status = ticket_count['ticket_Status']
            count = ticket_count['count']
            office_data[admin_profile.admin_Office][status] += count

        for data in office_data.values():
            data['Total'] = sum(data.values())

        # Calculate overall total for ticket counts
        overall_total_tickets = sum(data['Total'] for data in office_data.values())

        # Fetch ticket ratings
        ratings = TicketRating.objects.filter(
            ticket_Office=admin_profile.admin_Office, 
            date_Created__year=month_year.year, 
            date_Created__month=month_year.month
        )

        # Calculate count of each rating
        rating_counts = ratings.values('ticket_Rating').annotate(count=Count('ticket_Rating'))

        # Convert rating words to values and calculate the average rating
        total_ratings = ratings.count()
        average_rating = ratings.annotate(
            rating_value=Cast(
                Case(
                    When(ticket_Rating='Excellent', then=Value(5)),
                    When(ticket_Rating='Good', then=Value(4)),
                    When(ticket_Rating='Average', then=Value(3)),
                    When(ticket_Rating='Fair', then=Value(2)),
                    When(ticket_Rating='Poor', then=Value(1)),
                    output_field=FloatField()
                ),
                FloatField()
            )
        ).aggregate(total=Sum('rating_value'))['total'] or 0
        if total_ratings > 0:
            average_rating /= total_ratings

        # Determine remarks based on average rating
        if total_ratings > 0:
            if average_rating >= 4.5:
                remarks = 'Excellent'
            elif average_rating >= 3.5:
                remarks = 'Good'
            elif average_rating >= 2.5:
                remarks = 'Average'
            elif average_rating >= 1.5:
                remarks = 'Fair'
            else:
                remarks = 'Poor'
        else:
            remarks = 'No rating'

        ticket_rating_data = [{
            'office_name': admin_profile.admin_Office,
            'excellent': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Excellent'), 0),
            'good': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Good'), 0),
            'average': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Average'), 0),
            'fair': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Fair'), 0),
            'poor': next((item['count'] for item in rating_counts if item['ticket_Rating'] == 'Poor'), 0),
            'average_rating': round(average_rating, 2),
            'remarks': remarks
        }]

        # Fetch request counts
        request_counts = Request.objects.filter(
            date_Created__year=month_year.year, 
            date_Created__month=month_year.month,
            request_Office=admin_profile.admin_Office
        ).values('request_Office', 'request_Status').annotate(count=Count('request_Status'))

        # Initialize office data for request counts
        req_2 = {admin_profile.admin_Office: {'Pending': 0, 'Open': 0, 'Resolved': 0, 'Closed': 0}}

        for request_count in request_counts:
            status = request_count['request_Status']
            count = request_count['count']
            req_2[admin_profile.admin_Office][status] += count

        # Calculate total for each office
        for data in req_2.values():
            data['Total'] = sum(data.values())

        # Calculate overall total for request counts
        overall_total_requests = sum(data['Total'] for data in req_2.values())

        # Fetch request ratings
        request_ratings = Request.objects.filter(
            request_Office=admin_profile.admin_Office, 
            date_Created__year=month_year.year, 
            date_Created__month=month_year.month
        ).values_list('request_Rating', flat=True)

        # Filter out None values from request ratings
        request_ratings = [rating for rating in request_ratings if rating is not None]

        # Calculate the total number of ratings
        total_ratings = len(request_ratings)

        # Calculate the sum of all ratings
        total_rating_sum = sum(request_ratings)

        # Calculate the average rating
        average_rating = total_rating_sum / total_ratings if total_ratings > 0 else 0

        # Determine remarks
        if total_ratings == 0:
            remarks = 'No rating'
        elif average_rating >= 4.5:
            remarks = 'Excellent'
        elif average_rating >= 3.5:
            remarks = 'Good'
        elif average_rating >= 2.5:
            remarks = 'Average'
        elif average_rating >= 1.5:
            remarks = 'Fair'
        else:
            remarks = 'Poor'

        # Create a dictionary to store request rating data
        request_rating_data = [{
            'office_name': admin_profile.admin_Office,
            'excellent': request_ratings.count(5),
            'good': request_ratings.count(4),
            'average': request_ratings.count(3),
            'fair': request_ratings.count(2),
            'poor': request_ratings.count(1),
            'average_rating': round(average_rating, 2),
            'remarks': remarks
        }]


        context = {
            'office': admin_profile.admin_Office,
            'office_data': office_data,
            'req_office_data': req_2,
            'ticket_rating_data': ticket_rating_data,
            'request_rating_data': request_rating_data,
            'total_tickets': {
                'Pending': office_data[admin_profile.admin_Office]['Pending'],
                'Open': office_data[admin_profile.admin_Office]['Open'],
                'Resolved': office_data[admin_profile.admin_Office]['Resolved'],
                'Closed': office_data[admin_profile.admin_Office]['Closed'],
                'Overall_Total': overall_total_tickets,
            },
            'total_request': {
                'Pending': req_2[admin_profile.admin_Office]['Pending'],
                'Open': req_2[admin_profile.admin_Office]['Open'],
                'Resolved': req_2[admin_profile.admin_Office]['Resolved'],
                'Closed': req_2[admin_profile.admin_Office]['Closed'],
                'Overall_Total': overall_total_requests,
            },
            'month_year_str': month_year_str,
        }

        # Render the template and generate PDF
        template = get_template('admin/reports/adminmonthlyreport.html')
        html = template.render(context)
        pdf = render_to_pdf('admin/reports/adminmonthlyreport.html', context)
        return HttpResponse(pdf, content_type="application/pdf")
    else:
        return render(request, 'admin/reports/reports.html', {'error_message': 'Invalid request method.'})