from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid

# Create your models here.
# This section code all the model for the database
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    user_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100, null=False, unique=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    class Meta:
        db_table = 'User'

Student_Programs = [
    ('BSIT', 'Bachelor of Science in Information Technology'),
    ('BBTLEDHE', 'Bachelor of Business Technology and Livelihood Education major in Home Economics'),
    ('BTLEDICT', 'Bachelor of Business Technology and Livelihood Education major in Information Communication and Technology'),
    ('BSBAHRM', 'Bachelor of Science in Business Administration major in Human Resource Management'),
    ('BSBA-MM', 'Bachelor of Science in Business Administration major in Marketing Management'),
    ('BSENTREP', 'Bachelor of Science in Entrepreneurship'),
    ('BPAPFM', 'Bachelor of Public Administration major in Public Financial Management'),
    ('DOMTMOM', 'Diploma in Office Management Technology Medical Office Management'),
]

class UserProfile(models.Model):
    profile_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, editable=False, on_delete=models.RESTRICT, db_column='user_Id')
    user_Last_Name = models.CharField(max_length=50, null=False)
    user_First_Name = models.CharField(max_length=50, null=False)
    user_Middle_Name = models.CharField(max_length=50, null=True)
    user_Profile = models.FileField(upload_to='User-Profile/', null=True)
    user_Program = models.CharField(max_length=200, null=False)
    user_Email = models.EmailField(max_length=50, null=False)
    user_Contact = models.CharField(max_length=11, null=False)
    user_Gender = models.CharField(max_length=50, null=False)
    user_Type = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'User Profile'

class AdminProfile(models.Model):
    profile_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, editable=False, on_delete=models.RESTRICT, db_column='user_Id')
    admin_Last_Name = models.CharField(max_length=50, null=False)
    admin_First_Name = models.CharField(max_length=50, null=False)
    admin_Middle_Name = models.CharField(max_length=50, null=True)
    admin_Profile = models.FileField(upload_to='Admin-Profile/', null=True)
    admin_Email = models.EmailField(max_length=50, null=False)
    admin_Contact = models.CharField(max_length=11, null=False)
    admin_Gender = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Admin Profile'


# General Information and Services: Facilities
class Facilities(models.Model):
    facility_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    facility_Name = models.CharField(max_length=50, null=False)
    facility_Description = models.TextField(null=False)
    facility_Image = models.FileField(upload_to='Facilities/', null=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Facilities'

# General Information and Services: Services
class Service(models.Model):
    service_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    service_Name = models.CharField(max_length=100, null=False)
    service_Description = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Service'

# General Information and Services: Resources
class Resources(models.Model):
    resources_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    resources_Name = models.CharField(max_length=100, null=False)
    resources_File = models.FileField(upload_to='Campus-Resources/', null=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Resources'

# General Information and Services: Events
class Events(models.Model):
    event_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    event_Type = models.CharField(max_length=100, null=False)
    event_Name = models.CharField(max_length=100, null=False)
    event_Description = models.TextField(null=False)
    event_Image = models.FileField(upload_to='Events/', null=True)
    event_Date_Start = models.DateField(null=False)
    event_Date_End = models.DateField(null=False)
    event_Start = models.TimeField(null=False)
    event_End = models.TimeField(null=False)
    event_Venue = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Events'


# General Information and Services: Referrals
class ServiceReferrals(models.Model):
    referral_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    referral_Type = models.CharField(max_length=100, null=False)
    referral_Name = models.CharField(max_length=100, null=False)
    referral_Description = models.TextField(null=False)
    referral_More_Info = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Service Referrals'

# Student Support and Counseling: Counseling Services
class SupportCounseling(models.Model):
    counselor_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    counselor_Name = models.CharField(max_length=100, null=False)
    counselor_Contact = models.TextField(null=False)
    counselor_Specialization = models.CharField(max_length=255, null=False)
    counselor_Reach_Out = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Support Counseling'


# Student Support and Counseling: Academic Advising Referrals
class AcademicAdvising(models.Model):
    adviser_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    adviser_Name = models.CharField(max_length=100, null=False)
    adviser_Contact = models.TextField(null=False)
    adviser_Specialization = models.CharField(max_length=255, null=False)
    adviser_Reach_Out = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Academic Advising'

# Student Support and Counseling: Success Resources
class SuccessResources(models.Model):
    success_resources_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    success_resources_Name = models.CharField(max_length=100, null=False)
    success_resources_File = models.FileField(upload_to='Success-Resources/', null=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Success Resources'

#Financial Aid And Scholarships
class FinancialAndScholarshipGuide(models.Model):
    guide_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    guide_Number = models.CharField(max_length=100, null=False)
    guide_Type = models.CharField(max_length=100, null=False)
    guide_Program = models.CharField(max_length=100, null=False)
    guide_Description = models.TextField(null=False)
    guide_Apply = models.TextField(null=False)
    guide_Submit = models.TextField(null=False)
    guide_Contact = models.TextField(null=False)
    guide_Deadline_Start = models.DateField(null=False)
    guide_Deadline_End = models.DateField(null=False)
    guide_Remarks = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Financial Aid and Scholarship Guide'

# Career Services and Employment: Career Counseling
class CareerCounseling(models.Model):
    counseling_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    counseling_Name = models.CharField(max_length=100, null=False)
    counseling_Contact = models.CharField(max_length=100, null=False)
    counseling_Location = models.TextField(null=False)
    counseling_Service = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Career Counseling'
        
# Career Services and Employment: Job Search Resources
class JobSearch(models.Model):
    job_Search_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    job_Search_Title = models.CharField(max_length=100, null=False)
    job_Search_Type = models.CharField(max_length=100, null=False)
    job_Search_Description = models.TextField(null=False)
    job_Search_Link = models.URLField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Job Search Resources'

# Career Services and Employment: Job Posting
class JobPosting(models.Model):
    job_Posting_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    job_Posting_Type = models.CharField(max_length=100, null=False)
    job_Logo = models.FileField(upload_to='Company-Logo/', null=True)
    job_Posting_Position = models.CharField(max_length=100, null=False)
    job_Posting_Status = models.CharField(max_length=100, null=False)
    job_Posting_Company = models.CharField(max_length=100, null=False)
    job_Available_Position = models.IntegerField(null=False)
    job_Description = models.TextField(null=False)
    job_Duties = models.TextField(null=False)
    job_Qualifications = models.TextField(null=False)
    job_Requirements = models.TextField(null=False)
    job_Skills = models.TextField(null=False)
    job_Location = models.CharField(max_length=100, null=False)
    job_Contact = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Jobs and Internships'

#Student Government and Involvement
class StudentGovernment(models.Model):
    government_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    government_Type = models.CharField(max_length=100, null=False)
    government_Title = models.CharField(max_length=100, null=False)
    government_Name = models.CharField(max_length=100, null=False)
    government_Role = models.CharField(max_length=100, null=False)
    government_Description = models.TextField(null=False)
    government_Qualification = models.TextField(max_length=100, null=False)
    government_Participation = models.TextField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Student Government and Involvement'

#ID and Access Cards
class IDandCard(models.Model):
    guide_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    guide_Type = models.CharField(max_length=100, null=False)
    guide_Step_Number = models.IntegerField(null=False)
    guide_Title = models.CharField(max_length=100, null=False)
    guide_Text = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'ID and Access Card'

#Health and Wellness: Health Service Referrals
class HealthFacility(models.Model):
    health_Facility_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    health_Facility_Type = models.CharField(max_length=100, null=False)
    health_Facility_Name = models.CharField(max_length=100, null=False)
    health_Facility_Description = models.TextField(null=False)
    health_Facility_Location = models.CharField(max_length=100, null=False)
    health_Facility_Contact = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Health Facility'

#Health and Wellness: Health Insurance
class HealthInsurance(models.Model):
    health_Insurance_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    health_Insurance_Name = models.CharField(max_length=100, null=False)
    health_Insurance_Coverage = models.TextField(null=False)
    health_Insurance_Enrollment = models.TextField(null=False)
    health_Insurance_Contact = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Health Insurance'

# Housing and Accomodation: Housing Referrals
class HousingOptions(models.Model):
    housing_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    housing_Type = models.CharField(max_length=100, null=False)
    housing_Name = models.CharField(max_length=100, null=False)
    housing_Image = models.FileField(upload_to='Housing/', null=True)
    housing_Description = models.TextField(null=False)
    housing_Location = models.CharField(max_length=100, null=False)
    housing_Contact = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Housing Options'

# Housing and Accomodation: Off-Campus Living Assistance
class LivingAssistance(models.Model):
    assistance_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    assistance_Type = models.CharField(max_length=100, null=False)
    assistance_Name = models.CharField(max_length=100, null=False)
    assistance_Description = models.TextField(null=False)
    assistance_Link = models.URLField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Living Assistance'

# Transportation and Parking: Public Transportation Information
class TransportInfo(models.Model):
    transport_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    transport_Type = models.CharField(max_length=100, null=False)
    transport_Route = models.TextField(null=False)
    transport_Distance = models.CharField(max_length=100, null=False)
    transport_Fare = models.TextField(max_length=100, null=False)
    transport_Info = models.TextField(null=False)
    transport_Time = models.CharField(max_length=100, null=False)
    transport_Schedule = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Public Transportation'

# Transportation and Parking: Campus Parking Permits
class ParkingPermit(models.Model):
    permit_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    permit_Title = models.CharField(max_length=255, null=False)
    permit_Info = models.TextField(null=False)
    permit_Guide = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Parking Permit'
        
# Transportation and Parking: Parking Regulation
class ParkingRegulation(models.Model):
    regulation_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    regulation_Title = models.CharField(max_length=255, null=False)
    regulation_Info = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Parking Regulation'

#Lost and Found: Lost Items
class LostandFound(models.Model):
    item_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    item_Owner = models.CharField(max_length=255, null=False)
    item_Name = models.CharField(max_length=255, null=False)
    item_Image = models.ImageField(upload_to='Lost-Items/', null=True)
    item_Description = models.TextField(null=False)
    item_Last_Seen = models.CharField(max_length=255, null=False)
    item_Lost_Date = models.DateField(null=False)
    item_Lost_Time = models.TimeField(null=False)
    item_Status = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Lost Items'

#Lost and Found: Lost Item Retrieval Instructions
class RetrievalInstruction(models.Model):
    instruction_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    instruction_Step_Number = models.IntegerField(null=False)
    instruction_Title = models.CharField(max_length=255, null=False)
    instruction_Info = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Item Retrieval Steps'

# Feedback and Suggestion: Feedback
class Feedback(models.Model):
    feedback_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    feedback_Type = models.CharField(max_length=50, null=False)
    student_Id = models.CharField(max_length=50, null=False)
    student_Name = models.CharField(max_length=50, null=False)
    feedback_Text = models.TextField(null=False)
    feedback_Status = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Feedback and Suggestions'

#Frequently Asked Questions
class FAQ(models.Model):
    FAQ_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    FAQ_Category = models.CharField(max_length=100, null=False)
    FAQ_Question = models.CharField(max_length=200, null=False)
    FAQ_Answer = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Frequently Asked Questions'

class Ticket(models.Model):
    ticket_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    ticket_Number = models.CharField(max_length=100, null=False, unique=True)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    full_Name = models.CharField(max_length=100, null=False)
    ticket_Status = models.CharField(max_length=100, null=False)
    ticket_Title = models.CharField(max_length=100, null=False)
    ticket_Description = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Ticket'

class TicketComment(models.Model):
    comment_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    full_Name = models.CharField(max_length=100, null=False)
    ticket_Id = models.ForeignKey(Ticket, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='ticket_Id')
    comment_Text = models.TextField(null=False)
    comment_Attachment = models.FileField(upload_to='Ticket-Attachment/', null=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Ticket Comment'

# Charter
class Charter(models.Model):
    charter_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    charter_Number = models.CharField(max_length=100, null=False)
    charter_Office = models.CharField(max_length=100, null=False)
    charter_Category = models.CharField(max_length=100, null=False)
    charter_Title = models.CharField(max_length=200, null=False)
    charter_Description = models.TextField(null=False)
    charter_Classification = models.CharField(max_length=100, null=False)
    charter_Transaction = models.CharField(max_length=100, null=False)
    charter_Avail = models.CharField(max_length=100, null=False)
    charter_Requirements = models.TextField(null=False)
    charter_Secure = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Charter'

# Charter Step
class CharterSteps(models.Model):
    step_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    charter_Id = models.ForeignKey(Charter, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='charter_Id')
    step_Client = models.TextField(null=False)
    step_Agency = models.TextField(null=False)
    step_Fees = models.CharField(max_length=100, null=False)
    step_Time = models.CharField(max_length=100, null=False)
    step_Person = models.CharField(max_length=100, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Charter Steps'