# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from mi_tienda.models import Product

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


def form_view(request):

    return render(request, "name.html")


def product_page(request, product_number):

    p_name = str(product_number)
    #get the item list
    #get item name, stock, price, description, video and image
    requested = Product.objects.get(name="arduino_uno")
    image_url = ""
    video_url = ""
    return render(request, "product_page.html", {'p_name':p_name, 'image':image_url, 'video':video_url})


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
            print(data)
            # redirect to a new URL:
            return HttpResponseRedirect('/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = orderForm()

    return render(request, 'order.html', {'form': form})
