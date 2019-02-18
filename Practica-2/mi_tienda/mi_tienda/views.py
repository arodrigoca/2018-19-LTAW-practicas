from django.http import HttpResponse
from django.template import Template, Context

def mi_funcion(request):

	html = "Hola! Mi primera UrL!!"

	return HttpResponse(html)


def mi_producto(request, param): #param will be the string placed in $

    numero = int(param)
    html = "Acceso a producto: %i" % numero
    return HttpResponse(html)



def saludo(request):

    fp = open('htdocs/index.html')
    # --Procesar la plantilla
    t = Template(fp.read())
    fp.close
    # -- Crear el contexto: Nombre de usuario real
    c = Context({'user':'Emperador Machacasaurio'})

    # -- Obtener la pagina html final
    html = t.render(c)
    return HttpResponse(html)
