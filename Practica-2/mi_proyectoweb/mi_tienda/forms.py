from django import forms

class orderForm(forms.Form):

    item = forms.CharField(max_length=200)
    quantity = forms.IntegerField()
    address = forms.CharField(max_length=200)
    username = forms.CharField(max_length=200)
