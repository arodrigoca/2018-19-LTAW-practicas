# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from mi_tienda.models import Product
from mi_tienda.models import Order

from mi_tienda.forms import orderForm

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


def product_page(request, product_name):

    #get the item list
    #get item name, stock, price, description, video and image
    requested = Product.objects.get(name=product_name)
    image_path = 'media/' + requested.item_image
    video_path = 'media/' + requested.item_video_url
    return render(request, "product_page.html", {'p_name':requested.name, 'image':image_path, 'video':video_path, 'price':requested.price})


def search_item(request):

    if request.method == 'GET':

        search_query = request.GET.get('search_box', None)
        return HttpResponse('<p>this is a placeholder</p>')


def get_order(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = orderForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            data = form.cleaned_data
            item_price = Product.objects.all().filter(name__contains=data['item'])[0].price
            order_price = item_price * data['quantity']
            ord = Order(item=data['item'], quantity=data['quantity'], address=data['address'], username=data['username'], total_price=order_price)
            ord.save()
            # redirect to a new URL:
            return HttpResponse('<p>Your order has been placed.</p><a href="../">Return to main page</a>')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = orderForm()

    return render(request, 'order.html', {'form': form})
