from django.db import models

# Create your models here.
class Detection(models.Model):
    detected =models.CharField(max_length=100)

class Frame(models.Model):
    img=models.ImageField()
