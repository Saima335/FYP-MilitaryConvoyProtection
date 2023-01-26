from rest_framework import serializers
from .models import Detection
from .models import Frame

class DetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Detection
        fields = ['id','detected']

class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model=Frame
        fields = ['id','img']