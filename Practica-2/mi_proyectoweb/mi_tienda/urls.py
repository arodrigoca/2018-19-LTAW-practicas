from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home_view),
    url(r'^list/', views.list_items),
    url(r'^product/(?P<product_name>\w{0,50})/$', views.product_page),
    url(r'^order.html', views.get_order),
    url(r'^your-order/', views.get_order),
]
