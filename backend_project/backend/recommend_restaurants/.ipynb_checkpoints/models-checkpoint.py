from django.db import models

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=128)
    address = models.CharField(max_length=256, unique=True)
    catch = models.CharField(max_length=512, blank=True)
    wifi = models.CharField(max_length=32)
    child = models.CharField(max_length=32)
    budget = models.CharField(max_length=128)
    genre = models.CharField(max_length=32)
    sub_genre = models.CharField(max_length=64)
    
    def __str__(self):
        return f"{self.name}"
    
# class Photo(models.Model):
    
    