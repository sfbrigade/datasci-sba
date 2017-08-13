from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from firstapp.models import sba_zip_level, IrsZipData

# Create your views here.

def index(request):
    """Hello World"""
    zipcode_num = sba_zip_level.objects.count()
    avg_mean_agi = sba_zip_level.objects.all().aggregate(Avg('mean_agi'))['mean_agi__avg']
    avg_total_small_bus = sba_zip_level.objects.all().aggregate(Avg('total_small_bus'))['total_small_bus__avg']
    avg_total_sba = sba_zip_level.objects.all().aggregate(Avg('total_sba'))['total_sba__avg']
    avg_sba_per_small_bus = sba_zip_level.objects.all().aggregate(Avg('sba_per_small_bus'))['sba_per_small_bus__avg']

    print(avg_mean_agi)
    context = {
    	'zipcode_num': zipcode_num,
    	'avg_mean_agi': avg_mean_agi,
    	'avg_total_small_bus': avg_total_small_bus,
    	'avg_total_sba': avg_total_sba,
    	'avg_sba_per_small_bus': avg_sba_per_small_bus,
    }

    return render(request, 'firstapp/index.html', context=context)




@require_GET
def zips(request):
    """API endpoint returning list of zips"""
    result = {
        'status': 'success',
        # use comprehension to convert from queryset to list of dicts, otherwise json lib can't serialize it
        'data': [x for x in sba_zip_level.objects.values()],
    }
    return JsonResponse(result)
