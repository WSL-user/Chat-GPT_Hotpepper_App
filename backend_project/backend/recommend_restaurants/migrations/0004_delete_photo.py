# Generated by Django 4.2 on 2023-04-15 05:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recommend_restaurants', '0003_photo'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Photo',
        ),
    ]