# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from mi_tienda.models import Product

# Create your views here.
def home_view (request):

    return render(request, "index.html", {'user':'Delorean'})

def list_items(request):

    products = Product.objects.all()
    html = "<p>Listado de articulos</p>"
    for item in products:
        print(item.name)
        html += '<p>'+ item.name + ' ' + str(item.price) + '<p>'

    return HttpResponse(html)



def product_page(request, product_number):

    p_name = str(product_number)
    #get the item list
    #get item name, stock, price, description, video and image
    return render(request, "product_page.html", {'list':items_list})
