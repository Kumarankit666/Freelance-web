from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'client', 'client_name', 'title', 'skills_required', 'budget', 'duration', 'created_at']
        read_only_fields = ['id', 'client', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['client'] = request.user
        return super().create(validated_data)
