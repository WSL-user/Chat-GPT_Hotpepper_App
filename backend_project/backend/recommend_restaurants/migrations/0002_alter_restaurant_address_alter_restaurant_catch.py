# Generated by Django 4.2 on 2023-04-15 04:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommend_restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='address',
            field=models.CharField(max_length=256, unique=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='catch',
            field=models.CharField(blank=True, max_length=512),
        ),
    ]