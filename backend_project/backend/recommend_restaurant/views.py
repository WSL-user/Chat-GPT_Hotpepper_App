from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Restaurant, Rating
from .serializers import RestaurantSerializer, RatingSerializer, UserSerializer, RestaurantAllSerializer
from .hotpepper import ask_hotpepper, insert_objects
from .chatGPT import ask_chatGPT

import requests

import logging

def index(request):
    response = "Hello World!"  # ChatGPT("Hello World!")
    return HttpResponse(response)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
#飲食店検索用のAPI操作View(?)
class RestaurantSearchView(generics.ListCreateAPIView):
    search_fields = ['name', 'station_name', 'genre', 'sub_genre', 'address']
    filter_backends = (filters.SearchFilter,)
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantAllSerializer
    
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    
#飲食店表示用のAPI操作View
class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    #飲食店のレーティング操作を行う関数
    #URL: f"http://localhost:8001/restaurants/restaurants_api/{pk}/rate_restaurants/"
    #NOTE まあチュートリアルで作ったやつで、正直要らないかな
    @action(detail=True, methods=['POST'])
    def rate_restaurants(self, request, pk=None):
        print(request)
        if 'stars' in request.data:
            restaurant = Restaurant.objects.get(id=pk)
            stars = request.data["stars"]
            user = request.user
            # user = User.objects.get(id=1)

            try:
                rating = Rating.objects.get(user=user.id, restaurant=restaurant.id)
                rating.stars = stars
                rating.save()
                serializer = RatingSerializer(rating, many=False)
                response = {"message": "Rating updated", 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except:
                rating = Rating.objects.create(user=user, restaurant=restaurant, stars=stars)
                serializer = RatingSerializer(rating, many=False)
                response = {"message": "Rating created", 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)

        else:
            response = {'message': 'you need to provide stars!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
    #引数のpkとidが一致するデータベース内の飲食店データについて,chatGPTに紹介文を作ってもらう関数
    #URL: f"http://localhost:8001/restaurants/restaurants_api/{pk}/ask_chatGPT_to_recommend_restaurant/"
    @action(detail=True, methods=['GET'])
    def ask_chatGPT_to_recommend_restaurant(self, request, pk=None):
        restaurant = Restaurant.objects.get(id=pk)
        try:
            recommendation_text = ask_chatGPT(restaurant)
            response = {"recommendation_text": recommendation_text}
            return Response(response, status=status.HTTP_200_OK)
        except:
            return Response({"chatGPT_failure" : "failed to call ChatGPT"}, status=status.HTTP_408_REQUEST_TIMEOUT)

    #検索クエリから、ホットペッパーAPIによって得られた飲食店達を新たにデータベースに追加
    #URL: f"http://localhost:8001/restaurants/restaurants_api/register_hotpepper_results/"
    @action(detail=False, methods=['POST'])
    def register_hotpepper_results(self, request):
        if 'hotpepper_query' in request.data:
            query = request.data["hotpepper_query"]
            query = query.replace("　", " ")
            try:
                hotpepper_response = ask_hotpepper(query, count=10)
            except:
                print("No hotpepper response")
                return Response(response, status=status.HTTP_404_NOT_FOUND)
            #TODO ここエラー出てるから直そう(修正済み)
            try:
                shops = insert_objects(hotpepper_response)
                print("shops : ", shops)
                response = {"message": "Hotpepper result added",}
                return Response(response, status=status.HTTP_200_OK)
            except:
                response = {"message": "Hotpepper result added",}
                return Response(response, status=status.HTTP_408_REQUEST_TIMEOUT)

        else:
            response = {'message': 'you need to provide hotpepper query!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def update(self, request, *args, **kwargs):
        response = {'message': 'you cannot update rating like that!'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'you cannot create rating like that!'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

