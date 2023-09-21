from django.db import models
import uuid
import bcrypt  

salt = bcrypt.gensalt()

# Create your models here.

# This section code all the model for the database

class User(models.Model):
    user_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Username = models.CharField(max_length=50, null=False)
    user_Password = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)

class UserProfile(models.Model):
    user_Profile_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, editable=False, on_delete=models.RESTRICT)
    user_Last_Name = models.CharField(max_length=50, null=False)
    user_First_Name = models.CharField(max_length=50, null=False)
    user_Middle_Name = models.CharField(max_length=50, null=False)
    user_Full_Name = models.CharField(max_length=50, null=False)
    user_Program = models.CharField(max_length=50, null=False)
    user_Email = models.CharField(max_length=50, null=False)
    user_Contact = models.IntegerField(null=False)
    user_Gender = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False, auto_now_add=True)

class AdminProfile(models.Model):
    admin_Profile_Id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    user_Id = models.ForeignKey(User, null=False, default=uuid.uuid4, editable=False, on_delete=models.RESTRICT)
    admin_Last_Name = models.CharField(max_length=50, null=False)
    admin_First_Name = models.CharField(max_length=50, null=False)
    admin_Middle_Name = models.CharField(max_length=50, null=False)
    admin_Full_Name = models.CharField(max_length=50, null=False)
    admin_Email = models.CharField(max_length=50, null=False)
    admin_Contact = models.IntegerField(null=False)
    admin_Gender = models.CharField(max_length=50, null=False)
    date_Created = models.DateTimeField(null=False)


    
