from django.contrib import admin
from .models import Detection

# Register your models here.
@admin.register(Detection)
class DetectionAdmin(admin.ModelAdmin):
    list_display=['id','detected']