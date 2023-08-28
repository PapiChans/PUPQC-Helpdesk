from django.db import models

# Create your models here.

# This section code all the model for the database

class User(models.Model):
    studentId = models.UUIDField(primary_key=True)
    studentNumber = models.CharField(max_length=50)
    studentUsername = models.CharField(max_length=50)
    studentPassword = models.CharField(max_length=50)

class Admin(models.Model):
    adminId = models.UUIDField(primary_key=True)
    adminNumber = models.CharField(max_length=50)
    adminUsername = models.CharField(max_length=50)
    adminPassword = models.CharField(max_length=50)

class UserProfile(models.Model):
    studentProfileId = models.UUIDField(primary_key=True)
    studentId = models.ForeignKey(User, on_delete=models.CASCADE)
    studentLastName = models.CharField(max_length=50)
    studentFirstName = models.CharField(max_length=50)
    studentMiddleName = models.CharField(max_length=50)
    studentFullName = models.CharField(max_length=50)
    studentProgram = models.CharField(max_length=50)
    studentEmail = models.CharField(max_length=50)
    studentContact = models.IntegerField()
    studentBirthday = models.DateField()
    studentGender = models.CharField(max_length=10)

class AdminProfile(models.Model):
    adminProfileId = models.UUIDField(primary_key=True)
    adminId = models.ForeignKey(Admin, on_delete=models.CASCADE)
    adminLastName = models.CharField(max_length=50)
    adminFirstName = models.CharField(max_length=50)
    adminMiddleMame = models.CharField(max_length=50)
    adminFullName = models.CharField(max_length=50)
    adminGender = models.CharField(max_length=10)

class Roles(models.Model):
    roleId = models.UUIDField(primary_key=True)
    roleName = models.CharField(max_length=50)

class UserRoles(models.Model):
    userRoleId = models.UUIDField(primary_key=True)
    roleId = models.ForeignKey(Roles, on_delete=models.CASCADE)
    studentId = models.ForeignKey(User, on_delete=models.CASCADE)

class AdminRoles(models.Model):
    adminRoleId = models.UUIDField(primary_key=True)
    roleId = models.ForeignKey(Roles, on_delete=models.CASCADE)
    adminId = models.ForeignKey(Admin, on_delete=models.CASCADE)
