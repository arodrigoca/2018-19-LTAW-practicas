# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Product (models.Model):
    name = models.CharField(max_length=200)
    stock = models.IntegerField()
    price = models.FloatField()
    description = models.CharField(max_length=200)
    item_video_url = models.CharField(max_length=200)
    item_image = models.CharField(max_length=200)
