"""
Declare serializers that work very similar to Django's forms.

The point of serializers is to provide a functionality to serialize or change
data into a format that Django uses, such as JSON

Building off of: http://www.django-rest-framework.org/tutorial/1-serialization/
"""
from rest_framework import serializers
from api_server.models import SbaRegionLevel


class SbaRegionLevelSerializer(serializers.Serializer):
    """Creating SBA Region Level Serializer"""
    id = serializers.IntegerField(read_only=True)
    region_type = serializers.CharField(required=False, allow_blank=True)
    region = serializers.CharField(required=False, allow_blank=True)
    sba_district_office = serializers.CharField(required=False, allow_blank=True)
    mean_agi = serializers.FloatField(required=False)
    total_small_bus = serializers.IntegerField(required=False)
    total_sba = serializers.IntegerField(required=False)
    total_504 = serializers.IntegerField(required=False)
    total_7a = serializers.IntegerField(required=False)
    sba_per_small_bus = serializers.FloatField(required=False)
    loan_504_per_small_bus = serializers.FloatField(required=False)
    loan_7a_per_small_bus = serializers.FloatField(required=False)

    def create(self, validated_data):
        """
        Create and return a new `SbaRegionLevel` instance, given the validated data.
        """
        return SbaRegionLevel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `SbaRegionLevel` instance, given the validated data.
        """
        instance.region_type = validated_data.get('region_type', instance.region_type)
        instance.region = validated_data.get('region', instance.region)
        instance.sba_district_office = validated_data.get('sba_district_office', instance.sba_district_office)
        instance.mean_agi = validated_data.get('mean_agi', instance.mean_agi)
        instance.total_small_bus = validated_data.get('total_small_bus', instance.total_small_bus)
        instance.total_sba = validated_data.get('total_sba', instance.total_sba)
        instance.total_504 = validated_data.get('total_504', instance.total_504)
        instance.total_7a = validated_data.get('total_7a', instance.total_7a)
        instance.sba_per_small_bus = validated_data.get('sba_per_small_bus', instance.sba_per_small_bus)
        instance.loan_504_per_small_bus = validated_data.get('loan_504_per_small_bus', instance.loan_504_per_small_bus)
        instance.loan_7a_per_small_bus = validated_data.get('loan_7a_per_small_bus', instance.loan_7a_per_small_bus)
        instance.save()
        return instance
