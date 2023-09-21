from rest_framework import serializers
from .models import User, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = ['user_Id', 'user_Username', 'user_Password', 'date_Created']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        field = '__all__'