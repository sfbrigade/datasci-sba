from django.conf.urls import url
from api_server import views

app_name = 'api_server'
urlpatterns = [
    url(r'^v1/regions$', views.regions, name='regions'),
    url(r'^v1/businesses$', views.businesses, name='businesses')
]
