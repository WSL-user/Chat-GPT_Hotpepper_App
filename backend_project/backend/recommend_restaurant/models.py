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
    # 駅名, 住所,
    def search(self, query=None):
        qs = self
        qs = qs.filter(public=True)


class Restaurant(models.Model):
    name = models.CharField(max_length=128)
    address = models.CharField(max_length=256, unique=True)
    catch = models.CharField(max_length=512, null=True, blank=True)
    wifi = models.CharField(max_length=32, null=True, blank=True)
    child = models.CharField(max_length=32, null=True, blank=True)
    budget = models.CharField(max_length=128, null=True, blank=True)
    genre = models.CharField(max_length=32, null=True, blank=True)
    sub_genre = models.CharField(max_length=64, null=True, blank=True)
    station_name = models.CharField(max_length=32, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    restaurant_image = models.OneToOneField(RestaurantPhoto, null=True, blank=True, on_delete=models.CASCADE)

    #CHANGED
    #青葉さんのhotpepper.py内のUSE_RETURN_FIELD_LIST内に入っており, 現在データベースのフィールドとして存在していないものを追加
    #access, barrier_free, close, coupon_urls, free_drink, free_food, id(=hotpepper_id), lunch, midnight, mobile_access, name_kana, non_smoking, open, parking, small_area追加
    access = models.CharField(max_length=256, null=True, blank=True)
    barrier_free = models.CharField(max_length=128, null=True, blank=True)
    close = models.CharField(max_length=64, null=True, blank=True)
    coupon_url = models.URLField(null=True, blank=True)
    free_drink = models.CharField(max_length=128, null=True, blank=True)
    free_food = models.CharField(max_length=128, null=True, blank=True)
    hotpepper_id = models.CharField(max_length=16, null=True, blank=True)
    lunch = models.CharField(max_length=64, null=True, blank=True)
    midnight = models.CharField(max_length=64, null=True, blank=True)
    mobile_access = models.CharField(max_length=128, null=True, blank=True)
    name_kana = models.CharField(max_length=128, null=True, blank=True)
    non_smoking = models.CharField(max_length=64, null=True, blank=True)
    open = models.CharField(max_length=128, null=True, blank=True)
    parking = models.CharField(max_length=64, null=True, blank=True)
    small_area_code = models.CharField(max_length=8, null=True, blank=True)
    small_area_name = models.CharField(max_length=16, null=True, blank=True)
    review = models.CharField(max_length=1024, null=True, blank=True)

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
    
    @property
    def essential_field_names(self):
        return [ f.name for f in self._meta.fields if not f.blank and not f.null]


class Rating(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'restaurant'),)
        index_together = (('user', 'restaurant'),)


