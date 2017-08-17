from django.shortcuts import render
from django.views.decorators.http import require_GET

@require_GET
def index(request):
    """base page for the front end app -- just static HTML, rest is rendered by JS"""
    return render(request, 'index.html')
