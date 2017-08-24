from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from api_server.models import SbaRegionLevel


def index(request):
    """Hello World"""
    zipcode_num = SbaRegionLevel.objects.count()
    avg_mean_agi = SbaRegionLevel.objects.all().aggregate(Avg('mean_agi'))['mean_agi__avg']
    avg_total_small_bus = SbaRegionLevel.objects.all().aggregate(
        Avg('total_small_bus'))['total_small_bus__avg']
    avg_total_sba = SbaRegionLevel.objects.all().aggregate(Avg('total_sba'))['total_sba__avg']
    avg_sba_per_small_bus = SbaRegionLevel.objects.all().aggregate(
        Avg('sba_per_small_bus'))['sba_per_small_bus__avg']

    context = {
        'zipcode_num': zipcode_num,
        'avg_mean_agi': avg_mean_agi,
        'avg_total_small_bus': avg_total_small_bus,
        'avg_total_sba': avg_total_sba,
        'avg_sba_per_small_bus': avg_sba_per_small_bus,
    }

    return render(request, 'api_server/index.html', context=context)


@require_GET
def regions(request):
    """API endpoint returning list of regions"""
    result = {
        'status': 'success',
        # use comprehension to convert from queryset to list of dicts, otherwise json lib can't serialize it
        'data': [x for x in SbaRegionLevel.objects.values()],
    }
    return JsonResponse(result)
