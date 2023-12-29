from django.db import models
import uuid

# Create your models here.
# This section code all the model for the database

class User(models.Model):
    user_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Username = models.CharField(max_length=50, null=False)
    user_Password = models.CharField(max_length=128, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'User'

class Admin(models.Model):
    admin_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    admin_Username = models.CharField(max_length=50, null=False)
    admin_Password = models.CharField(max_length=128, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Admin'

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
    user_Full_Name = models.CharField(max_length=100, null=True)
    user_Program = models.CharField(max_length=100, null=False, choices=Student_Programs)
    user_Email = models.EmailField(max_length=50, null=False)
    user_Contact = models.CharField(max_length=11, null=False)
    user_Age = models.IntegerField(null=False)
    user_Gender = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'User Profile'

class AdminProfile(models.Model):
    profile_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    admin_Id = models.ForeignKey(Admin, null=False, editable=False, on_delete=models.RESTRICT, db_column='admin_Id')
    admin_Last_Name = models.CharField(max_length=50, null=False)
    admin_First_Name = models.CharField(max_length=50, null=False)
    admin_Middle_Name = models.CharField(max_length=50, null=True)
    admin_Full_Name = models.CharField(max_length=100, null=True)
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

#Lost and Found
class Lost(models.Model):
    lost_Item_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    item_Name = models.CharField(max_length=50, null=False)
    item_Image = models.ImageField(upload_to='Lost-Items/', null=True)
    item_Description_Text = models.TextField(null=False)
    item_Last_Seen = models.CharField(max_length=50, null=False)
    item_Lost_Date = models.DateField(null=False)
    item_Lost_Time = models.TimeField(null=False)
    lost_Status = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Lost and Found'

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
    FAO_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    FAQ_Category = models.CharField(max_length=100, null=False)
    FAQ_Question = models.CharField(max_length=200, null=False)
    FAQ_Answer = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Frequently Asked Questions'