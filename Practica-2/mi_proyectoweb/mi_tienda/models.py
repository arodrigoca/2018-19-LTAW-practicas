# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Product (models.Model):
    name = models.CharField(max_length=200)
    stock = models.IntegerField()
    price = models.FloatField()
    description = models.CharField(max_length=200, default="no description")
    item_video_url = models.CharField(max_length=200, default="no url")
    item_image = models.CharField(max_length=200, default="no image")


class Order (models.Model):

    item = models.CharField(max_length=200)
    quantity = models.IntegerField()
    total_price = models.FloatField()
    address = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
