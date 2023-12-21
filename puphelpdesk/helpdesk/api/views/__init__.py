# ---------------
# Student Routes
# ---------------

# Dashboard
from .student.dashboard import *

# General Info and Services
from .student.GenInfoandServices.events import *
from .student.GenInfoandServices.resources import *
from .student.GenInfoandServices.facilities import *
from .student.GenInfoandServices.service import *
from .student.GenInfoandServices.referrals import *

# Student Support and Counseling
from .student.StudentCounseling.successresources import *

# Financial Aid and Scholarships
from .student.FinancialAid.financialaid import *

# Careers and Employment
from .student.StudentCareers.jobposting import *

# Feedback and Suggestions
from .student.Feedback.feedback import *

# ---------------
# Admin Routes
# ---------------

# Dashboard
from .admin.dashboard import *

# General Info and Services
from .admin.GenInfoandServices.events import *
from .admin.GenInfoandServices.resources import *
from .admin.GenInfoandServices.facilities import *
from .admin.GenInfoandServices.service import *
from .admin.GenInfoandServices.referrals import *

# Student Support and Counseling
from .admin.StudentCounseling.successresources import *

# Financial Aid and Scholarships
from .admin.FinancialAid.financialaid import *

# Careers and Employment
from .admin.StudentCareers.jobposting import *

# Feedback and Suggestions
from .admin.Feedback.feedback import *
from .admin.Feedback.suggestion import *