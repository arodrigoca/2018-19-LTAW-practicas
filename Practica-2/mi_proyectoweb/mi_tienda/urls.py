from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home_view),
    url(r'^list/', views.list_items),
    url(r'^product/(\d{1,2})/$', views.product_page),
]
