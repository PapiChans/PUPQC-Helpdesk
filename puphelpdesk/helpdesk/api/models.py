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
    failed_login_attempts = models.IntegerField(default=0)
    lockout_timestamp = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    def increment_failed_login_attempts(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 3:
            # Lock the account for 5 minutes
            self.lockout_timestamp = timezone.now() + timezone.timedelta(minutes=5)
        self.save()

    def reset_failed_login_attempts(self):
        self.failed_login_attempts = 0
        self.lockout_timestamp = None
        self.save()

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
    admin_Office = models.CharField(max_length=100, null=True)
    is_master_admin = models.BooleanField(default=False)
    is_technician = models.BooleanField(default=False) 
    class Meta:
        db_table = 'Admin Profile'

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

# Career Services and Employment: Job Posting
class JobPosting(models.Model):
    job_Posting_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    # job_Posting_Type = models.CharField(max_length=100, null=False)
    job_Posting_Category = models.CharField(max_length=100, null=False)
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

class Ticket(models.Model):
    ticket_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    ticket_Number = models.CharField(max_length=100, null=False, unique=True)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    full_Name = models.CharField(max_length=50, null=False)
    sender_Affiliation = models.CharField(max_length=100, null=False, default='')
    ticket_Status = models.CharField(max_length=100, null=False)
    ticket_Priority = models.CharField(max_length=100, null=False, default='')
    ticket_Type = models.CharField(max_length=100, null=False, default='')
    ticket_Title = models.CharField(max_length=30, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    ticket_Office = models.CharField(max_length=100, null=False, default='')
    ticket_Service = models.CharField(max_length=100, null=False, default='')
    resolved_Date = models.DateTimeField(null=True)
    last_ticket_date = models.DateField(null=True)
    ticket_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.ticket_Number:
            self.ticket_Number = self.generate_ticket_number()
        super(Ticket, self).save(*args, **kwargs)

    def generate_ticket_number(self):
        today = timezone.now().date()
        if self.last_ticket_date != today:
            self.last_ticket_date = today
            self.ticket_count = 0
            self.save()
        self.ticket_count += 1
        return f'T{today.strftime("%Y%m%d")}-{str(self.ticket_count).zfill(3)}'
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

# KnowledgeBase: Folders
class KBFolder(models.Model):
    folder_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    folder_Name = models.CharField(max_length=100, null=False)
    folder_Description = models.CharField(max_length=100, null=False, default='')
    class Meta:
        db_table = 'KB_Folder'

# KnowledgeBase: Topic
class KBTopic(models.Model):
    topic_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    folder_Id = models.ForeignKey(KBFolder, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='folder_Id')
    topic_Number = models.IntegerField(null=False, unique=True)
    topic_Name = models.CharField(max_length=100, null=False, default='')
    topic_Content = models.TextField(null=False)
    likes = models.IntegerField(null=False)
    dislikes = models.IntegerField(null=False)
    status = models.CharField(max_length=15, null=False, default='Unpublished')
    created_by = models.CharField(max_length=100, null=False, default='')
    date_Created = models.DateTimeField(null=False, default=timezone.now)
    last_modified = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'KB_Topic'

class TicketRating(models.Model):
    rating_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    ticket_Number = models.CharField(max_length=15, null=False)
    ticket_Office = models.CharField(max_length=100, null=False, default='')
    ticket_Rating = models.CharField(max_length=20, null=False)
    ticket_Remarks = models.CharField(max_length=100, null=True)
    date_Created = models.DateTimeField(null=False)
    resolved_Date = models.DateTimeField(null=False)
    class Meta:
        db_table = 'Ticket Rating'

class AuditTrail(models.Model):
    audit_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    audit_Reference = models.CharField(max_length=15, null=False, default='')
    audit_User = models.CharField(max_length=100, null=True)
    audit_Action = models.CharField(max_length=30, null=False)
    audit_Description = models.TextField(null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Audit Trail'

class Request(models.Model):
    request_Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_Number = models.CharField(max_length=100, null=False, unique=True)
    user_Id = models.ForeignKey(User, on_delete=models.RESTRICT, db_column='user_Id')
    full_Name = models.CharField(max_length=50, null=False)
    request_Status = models.CharField(max_length=100, null=False)
    request_Type = models.CharField(max_length=100, default='')
    request_Title = models.CharField(max_length=30, null=False)
    date_Created = models.DateTimeField(auto_now_add=True)
    request_Office = models.CharField(max_length=100, default='')
    request_Service = models.CharField(max_length=100, default='')
    resolved_Date = models.DateTimeField(null=True)
    last_request_date = models.DateField(null=True)
    request_Rating = models.IntegerField(null=True)
    request_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.request_Number:
            self.request_Number = self.generate_request_number()
        super().save(*args, **kwargs)

    def generate_request_number(self):
        today = timezone.now().date()
        if self.last_request_date != today:
            self.last_request_date = today
            self.request_count = 0
            self.save()
        self.request_count += 1
        return f'R{today.strftime("%Y%m%d")}-{self.request_count:03}'

    class Meta:
        db_table = 'Request'

class RequestComment(models.Model):
    comment_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='user_Id')
    full_Name = models.CharField(max_length=100, null=False)
    request_Id = models.ForeignKey(Request, null=False, default=uuid.uuid4, on_delete=models.RESTRICT, db_column='request_Id')
    comment_Text = models.TextField(null=False)
    comment_Attachment = models.FileField(upload_to='Request-Attachment/', null=True)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)
    class Meta:
        db_table = 'Request Comment'

class Evaluation(models.Model):
    eval_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    eval_Reference = models.CharField(max_length=50, null=False, unique=True)
    eval_Status = models.CharField(max_length=30, null=False, default='New')
    eval_Client = models.CharField(max_length=30, null=True)
    eval_Gender = models.CharField(max_length=30, null=True)
    QA = models.IntegerField(null=True)
    QB = models.IntegerField(null=True)
    QC = models.IntegerField(null=True)
    QD = models.IntegerField(null=True)
    QE = models.IntegerField(null=True)
    QF = models.IntegerField(null=True)
    QG = models.IntegerField(null=True)
    QH = models.IntegerField(null=True)
    remarks = models.CharField(max_length=100, null=True)
    date_filled = models.DateTimeField(null=True)
    class Meta:
        db_table = 'Evaluation'