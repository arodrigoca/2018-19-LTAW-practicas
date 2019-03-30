from django import forms
from mi_tienda.models import Product

class orderForm(forms.Form):

    products = Product.objects.all()
    counter = 1
    ch = []
    for item in products:
        ch.append((item.name, item.name))
        counter = counter + 1

    #i =[("1", "Option 1"), ("2", "Option 2")]
    item = forms.ChoiceField(choices=ch, label="Choices")
    quantity = forms.IntegerField()
    address = forms.CharField(max_length=200)
    username = forms.CharField(max_length=200)
