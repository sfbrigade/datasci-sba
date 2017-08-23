from django.conf.urls import url
from web_app import views

app_name = 'web_app'
urlpatterns = [
    url(r'^$', views.index, name='index'),
]
