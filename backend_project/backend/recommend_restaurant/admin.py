from django.contrib import admin
from .models import Restaurant, RestaurantPhoto, Rating

# Register your models here.
class RestaurantAdmin(admin.ModelAdmin):
    readonly_fields = ['id']
admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(RestaurantPhoto)
admin.site.register(Rating)