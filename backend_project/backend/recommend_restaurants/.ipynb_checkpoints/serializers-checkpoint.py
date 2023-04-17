from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Restaurant, Rating
class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ["id", "name", "address", "budget", "catch", "child", "genre", "wifi", "sub_genre", "url", "station_name", "no_of_ratings", "avg_rating"]


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "stars", "user", "restaurant"]
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {'password': {'write_only': True, 'required' : True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user
        