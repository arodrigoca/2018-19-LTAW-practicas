from django.http import HttpResponse
from django.template import Template, Context


def base(request):

	html = "Hola! Mi primera UrL!!"

	return HttpResponse(html)
