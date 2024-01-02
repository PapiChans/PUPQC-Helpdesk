from rest_framework import serializers
from .models import User, Resources, Events, Facilities, SuccessResources, Feedback, Lost, Service, JobPosting, FinancialAndScholarshipGuide, ServiceReferrals, IDandCard, StudentGovernment, JobSearch, CareerCounseling, SupportCounseling, AcademicAdvising, HealthFacility, HealthInsurance, HousingOptions, LivingAssistance

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

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class FinancialAndScholarshipGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialAndScholarshipGuide
        fields = '__all__'

class ServiceReferralsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceReferrals
        fields = '__all__'

class IDandCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDandCard
        fields = '__all__'

class StudentGovernmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentGovernment
        fields = '__all__'

class CareerCounselingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerCounseling
        fields = '__all__'

class JobSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSearch
        fields = '__all__'

class SupportCounselingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportCounseling
        fields = '__all__'

class AcademicAdvisingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicAdvising
        fields = '__all__'

class HealthFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthFacility
        fields = '__all__'

class HealthInsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthInsurance
        fields = '__all__'

class HousingOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousingOptions
        fields = '__all__'

class LivingAssistanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LivingAssistance
        fields = '__all__'