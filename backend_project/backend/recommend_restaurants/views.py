from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Restaurant, Rating
from .serializers import RestaurantSerializer, RatingSerializer, UserSerializer
from .hotpepper import ask_hotpepper

import openai
import requests

import logging


# Create your views here.
openai.api_key='YOUR-OPENAI-API-KEY'

def index(request):
    response = "Hello World!" #ChatGPT("Hello World!")
    return HttpResponse(response)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.all()
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    
    @action(detail=True, methods=['POST'])
    def rate_restaurants(self, request, pk=None):
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
                response = {"message" : "Rating updated", 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except:
                rating = Rating.objects.create(user=user, restaurant=restaurant, stars=stars)
                serializer = RatingSerializer(rating, many=False)
                response = {"message" : "Rating created", 'result': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
           
        else:
            response = {'message' : 'you need to provide stars!'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all()
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny,)
    
    def update(self, request, *args, **kwargs):
        response = {'message' : 'you cannot update rating like that!'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
     
    def create(self, request, *args, **kwargs):
        response = {'message' : 'you cannot create rating like that!'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)
    

# class HotPepperView(View):
    
#     restaurants = Restaurant.objects.all()
    
#     output = f"We have {len(restaurants)} restaurants in DB"
    
#     def get(self, request):
#         keyword = "東京 もんじゃ"
#         count=10
#         body = {
#           'key':HOTPEPPER_API_KEY,
#           'keyword': keyword, #
#           'format':'json',
#           'count':count,
#           'type':"special"
#         }
#         response = requests.get(URL,body)
    
#         return HttpResponse(self.output)

# class ChatGPTView(View):
#     #chatGPTを呼ぶ関数
#     def ChatGPT(self, user_query, model_engine="text-davinci-003"):
#         ''' 
#         This function uses the OpenAI API to generate a response to the given 
#         user_query using the ChatGPT model
#         '''
#         # Use the OpenAI API to generate a response
#         completion = openai.Completion.create(
#               engine = model_engine,
#               prompt = user_query,
#               max_tokens = 1024,
#               n = 1,
#               temperature = 0.5,
#         )
#         response = completion.choices[0].text
#         return response
    
#     def get(self, request):
#         response = self.ChatGPT("What is the definition of RLHF in LLMs?")

#         return HttpResponse(response)