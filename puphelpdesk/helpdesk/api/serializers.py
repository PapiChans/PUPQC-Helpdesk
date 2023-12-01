from rest_framework import serializers
from .models import User, Resources, Events, Facilities, SuccessResources, Feedback, Lost, FinancialAidGuide, ScholarshipOpportunities, Service

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

class FacilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facilities
        fields = '__all__'

class SuccessResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuccessResources
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class LostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lost
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

#Financial Aid And Scholarships Serializers
class FinancialAidGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialAidGuide
        fields = '__all__'

class ScholarshipOpportunitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipOpportunities
        fields = '__all__'

