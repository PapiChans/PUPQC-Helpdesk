from rest_framework import serializers
from .models import User, Resources, Events, SuccessResources

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resources
        fields = '__all__'

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'

class SuccessResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessResources
        fields = '__all__'