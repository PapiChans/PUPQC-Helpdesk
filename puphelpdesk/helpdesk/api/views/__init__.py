# ---------------
# Student Routes
# ---------------

# Dashboard
from .student.dashboard import *

# General Info and Services
from .student.GenInfoandServices.events import *
from .student.GenInfoandServices.resources import *
from .student.GenInfoandServices.facilities import *

# Student Support and Counseling
from .student.StudentCounseling.successresources import *

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

# Student Support and Counseling
from .admin.StudentCounseling.successresources import *

# Feedback and Suggestions
from .admin.Feedback.feedback import *
from .admin.Feedback.suggestion import *