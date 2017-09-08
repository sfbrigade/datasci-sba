from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

import random

from api_server.models import SbaRegionLevel, SbaSfdo


@require_GET
def regions(request):
    """API endpoint returning list of regions"""
    result = {
        'status': 'success',
        # use comprehension to convert from queryset to list of dicts, otherwise json lib can't serialize it
        'data': [x for x in SbaRegionLevel.objects.values()],
    }
    return JsonResponse(result)


def businesses(request):
	""" API endpoint returning list of businesses that SBA has loaned to"""
	result = {
	    'status': 'success',
	    'data': [addDummyData(x) for x in SbaSfdo.objects.values('id', 'borr_name')]
	}
	return JsonResponse(result)


def addDummyData(dict):
    """ HACK: adding random lat/long and yelp rating, until those pull requests are merged and we can use real data"""
    dict['latitude'] = 37.2 + 1*random.random()
    dict['longitude'] = -122.5 + 1*random.random()
    dict['yelp_rating'] = 5*random.random()
    return dict