
from django.conf.urls import include, url
from django.contrib import admin
from mi_tienda.views import mi_funcion
from mi_tienda.views import mi_producto
from mi_tienda.views import saludo
from mi_tienda.views import index


urlpatterns = [
    url('', index),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^hola/', mi_funcion),
    url(r'^producto/(\d{1,2})/$', mi_producto), #after producto, indicate the valid template for url (2 digits) and the $ indicates parameter
    url(r'^saludo/', saludo),
]
