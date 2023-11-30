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
class ServiceOffered(models.Model):
    service_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    service_Name = models.CharField(max_length=100, null=False)
    service_Description = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Service Offered'

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
    referral_Name = models.CharField(max_length=100, null=False)
    referral_Description = models.TextField(null=False)
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

#Lost and Found
class Lost(models.Model):
    lostItem_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable="False")
    item_Name = models.CharField(max_length=50, null="False")
    report_Date = models.DateField(null="False")
    item_image = models.ImageField(upload_to='Lost-Items/', null=True)
    itemDesc_text = models.TextField(null="False")
    class Meta:
        db_table = 'Lost Items'