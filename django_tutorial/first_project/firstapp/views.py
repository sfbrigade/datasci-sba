from django.shortcuts import render
from django.http import HttpResponse

from models import CensusZipBusinessPatterns, IrsZipData

# Create your views here.

def index(request):
    """Hello World"""
    czbp_count = CensusZipBusinessPatterns.objects.count()
    return render(request, 'firstapp/index.html', context={'zipcode_num': czbp_count})
