from django.urls import path, include

from . import views
from .views import UserViewSet, RestaurantViewSet, RatingViewSet #ChatGPTView, HotPepperView
from rest_framework import routers

router = routers.DefaultRouter()
router.register('restaurants_api', RestaurantViewSet)
router.register('ratings_api', RatingViewSet)
router.register('users', UserViewSet)


urlpatterns = [
    path("", include(router.urls)),
    # path("chatGPT", ChatGPTView.as_view()),
    # path("hotpepper", HotPepperView.as_view()),
]