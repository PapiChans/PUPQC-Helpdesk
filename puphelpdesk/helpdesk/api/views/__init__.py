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

# Careers and Employment
from .student.StudentCareers.jobposting import *

# Lost and Found
from .student.LostAndFound.ItemLost import *

# Feedback and Suggestions
from .student.Feedback.feedback import *

# Ticket
from .student.Ticket.ticket import *

# Ticket Rating
from .student.TicketRating.rating import *

# Evaluation
from .student.Evaluation.evaluation import *

# ---------------
# Admin Routes
# ---------------

# Profile
from .admin.profile import *

# Dashboard
from .admin.dashboard import *

# User Management
from .admin.UserManagement.usermanagement import *
from .admin.UserManagement.adminmanagement import *

# General Info and Services
from .admin.GenInfoandServices.events import *

# Careers and Employment
from .admin.StudentCareers.jobposting import *

# Lost and Found
from .admin.LostAndFound.ItemLost import *

# Feedback and Suggestions
from .admin.Feedback.feedback import *
from .admin.Feedback.suggestion import *

# Ticket
from .admin.Ticket.ticket import *

# Ticket Rating
from .admin.TicketRating.rating import *

# Knowledgebase
from .admin.Knowledgebase.folder import *
from .admin.Knowledgebase.topic import *

# Audit Trail
from .admin.AuditTrail.audittrail import *

# Request
from .admin.TicketRequest.ticketrequest import *

# ---------------
# Knoweledgebase
# ---------------

from .knowledgebase.knowledgebase import *

# ---------------
# Reports
# ---------------

from .admin.reports.reports import *