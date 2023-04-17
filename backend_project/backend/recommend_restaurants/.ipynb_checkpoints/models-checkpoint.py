from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.

class RestaurantPhoto(models.Model):
    photo_l = models.ImageField(upload_to='image_upload/', blank=True)
    photo_m = models.ImageField(upload_to='image_upload/', blank=True)
    photo_s = models.ImageField(upload_to='image_upload/', blank=True)
    
class RestaurantQuerySet(models.QuerySet):
    #駅名, 住所, 
    def search(self, query=None):
        qs = self
        qs = qs.filter(public=True)
        
    
class Restaurant(models.Model):
    name = models.CharField(max_length=128)
    address = models.CharField(max_length=256, unique=True)
    catch = models.CharField(max_length=512, blank=True)
    wifi = models.CharField(max_length=32)
    child = models.CharField(max_length=32)
    budget = models.CharField(max_length=128)
    genre = models.CharField(max_length=32)
    sub_genre = models.CharField(max_length=64)
    station_name = models.CharField(max_length=32, null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    
    restaurant_image = models.OneToOneField(RestaurantPhoto, null=True, blank=True, on_delete=models.CASCADE)
    
    def no_of_ratings(self):
        ratings = Rating.objects.filter(restaurant=self)
        return len(ratings)
    
    def avg_rating(self):
        sum = 0
        ratings = Rating.objects.filter(restaurant=self)
        for rating in ratings:
            sum += rating.stars
        if len(ratings) > 0:
            return sum / len(ratings)
        else:
            return 0
    
    def __str__(self):
        return f"{self.name}"
    
class Rating(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    class Meta:
        unique_together = (('user', 'restaurant'),)
        index_together = (('user', 'restaurant'),)

    
    