from django.conf.urls import url
from api_server import views

app_name = 'api_server'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^v1/regions$', views.regions, name='regions'),
]
