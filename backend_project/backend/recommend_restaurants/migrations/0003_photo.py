# Generated by Django 4.2 on 2023-04-15 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommend_restaurants', '0002_alter_restaurant_address_alter_restaurant_catch'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_l', models.ImageField(blank=True, null=True, upload_to='image_upload')),
                ('photo_m', models.ImageField(blank=True, null=True, upload_to='image_upload')),
                ('photo_s', models.ImageField(blank=True, null=True, upload_to='image_upload')),
            ],
        ),
    ]
