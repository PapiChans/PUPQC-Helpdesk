# ---------------
# Authentication
# ---------------
from .auth.signup import *
from .auth.login import *
from .auth.logout import *
from .auth.getprofile import *
from .auth.session import *

# ---------------
# Student Routes
# ---------------

# Profile
from .student.profile import *

# Dashboard
from .student.dashboard import *

# General Info and Services
from .student.GenInfoandServices.events import *
from .student.GenInfoandServices.resources import *
from .student.GenInfoandServices.facilities import *
from .student.GenInfoandServices.service import *
from .student.GenInfoandServices.referrals import *

# Student Support and Counseling
from .student.StudentCounseling.counseling import *
from .student.StudentCounseling.advising import *
from .student.StudentCounseling.successresources import *

# Financial Aid and Scholarships
from .student.FinancialAid.financialaid import *

# Careers and Employment
from .student.StudentCareers.counseling import *
from .student.StudentCareers.jobsearch import *
from .student.StudentCareers.jobposting import *

# ID and Access Cards
from .student.IDandCard.IDandCard import *

# Student Government and Involvement
from .student.StudentGovernment.studgovernment import *

# Health and Wellness
from .student.HealthWellness.insurance import *
from .student.HealthWellness.programs import *

# Housing and Accomodation
from .student.HousingAndAccomodation.assistance import *
from .student.HousingAndAccomodation.referrals import *

# Transportation and Parking
from .student.TransportationAndParking.transport import *
from .student.TransportationAndParking.permit import *
from .student.TransportationAndParking.regulation import *

# Lost and Found
from .student.LostAndFound.ItemLost import *
from .student.LostAndFound.retrieval import *

# Feedback and Suggestions
from .student.Feedback.feedback import *

# FAQ
from .student.FAQ.faq import *

# Ticket
from .student.Ticket.ticket import *
from .student.sendTickets.sendTickets import *

# Charter
from .student.Charter.charter import *

# ---------------
# Admin Routes
# ---------------

# Profile
from .admin.profile import *

# Dashboard
from .admin.dashboard import *

# User Management
from .admin.UserManagement.usermanagement import *

# General Info and Services
from .admin.GenInfoandServices.events import *
from .admin.GenInfoandServices.resources import *
from .admin.GenInfoandServices.facilities import *
from .admin.GenInfoandServices.service import *
from .admin.GenInfoandServices.referrals import *

# Student Support and Counseling
from .admin.StudentCounseling.counseling import *
from .admin.StudentCounseling.advising import *
from .admin.StudentCounseling.successresources import *

# Financial Aid and Scholarships
from .admin.FinancialAid.financialaid import *

# Careers and Employment
from .admin.StudentCareers.counseling import *
from .admin.StudentCareers.jobsearch import *
from .admin.StudentCareers.jobposting import *

# ID and Access Cards
from .admin.IDandCard.IDandCard import *

# Student Government and Involvement
from .admin.StudentGovernment.studgovernment import *

# Health and Wellness
from .admin.HealthWellness.insurance import *
from .admin.HealthWellness.programs import *

# Housing and Accomodation
from .admin.HousingAndAccomodation.assistance import *
from .admin.HousingAndAccomodation.referrals import *

# Transportation and Parking
from .admin.TransportationAndParking.transport import *
from .admin.TransportationAndParking.permit import *
from .admin.TransportationAndParking.regulation import *

# Lost and Found
from .admin.LostAndFound.ItemLost import *
from .admin.LostAndFound.retrieval import *

# Feedback and Suggestions
from .admin.Feedback.feedback import *
from .admin.Feedback.suggestion import *

# FAQ
from .admin.FAQ.faq import *

# Ticket
from .admin.Ticket.ticket import *

# Charter
from .admin.Charter.charter import *

# Knowledgebase
from .admin.Knowledgebase.category import *
from .admin.Knowledgebase.folder import *
from .admin.Knowledgebase.topic import *

# ---------------
# Knoweledgebase
# ---------------

from .knowledgebase.knowledgebase import *