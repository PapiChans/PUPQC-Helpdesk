from django.db import models

# Create your models here.

class User(models.Model):
    student_id = models.UUIDField(primary_key=True)
    student_number = models.CharField(max_length=50)
    student_username = models.CharField(max_length=50)
    student_password = models.CharField(max_length=50)

class Admin(models.Model):
    admin_id = models.UUIDField(primary_key=True)
    admin_number = models.CharField(max_length=50)
    admin_username = models.CharField(max_length=50)
    admin_password = models.CharField(max_length=50)

class UserProfile(models.Model):
    student_profile_id = models.UUIDField(primary_key=True)
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)
    student_last_name = models.CharField(max_length=50)
    student_first_name = models.CharField(max_length=50)
    student_middle_name = models.CharField(max_length=50)
    student_full_name = models.CharField(max_length=50)
    student_program = models.CharField(max_length=50)
    student_email = models.CharField(max_length=50)
    student_contact = models.IntegerField()
    student_birthday = models.DateField()
    student_gender = models.CharField(max_length=10)

class AdminProfile(models.Model):
    admin_profile_id = models.UUIDField(primary_key=True)
    admin_id = models.ForeignKey(Admin, on_delete=models.CASCADE)
    admin_last_name = models.CharField(max_length=50)
    admin_first_name = models.CharField(max_length=50)
    admin_middle_name = models.CharField(max_length=50)
    admin_full_name = models.CharField(max_length=50)
    admin_gender = models.CharField(max_length=10)

class Roles(models.Model):
    role_id = models.UUIDField(primary_key=True)
    role_name = models.CharField(max_length=50)

class UserRoles(models.Model):
    user_role_id = models.UUIDField(primary_key=True)
    role_id = models.ForeignKey(Roles, on_delete=models.CASCADE)
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)

class AdminRoles(models.Model):
    admin_role_id = models.UUIDField(primary_key=True)
    role_id = models.ForeignKey(Roles, on_delete=models.CASCADE)
    admin_id = models.ForeignKey(Admin, on_delete=models.CASCADE)
