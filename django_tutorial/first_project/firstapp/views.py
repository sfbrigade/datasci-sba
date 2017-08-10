from django.shortcuts import render
from django.http import HttpResponse
from firstapp.models import SBAMetrics

# Create your views here.

def index(request):
    """Hello World"""
    data = SBAMetrics.objects.all()
    my_dict = {'data': data}
    return render(request, 'firstapp/index.html', context=my_dict)
