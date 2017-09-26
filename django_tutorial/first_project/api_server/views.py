from django.db import connection
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

import random

from api_server.models import SbaRegionLevel, SbaSfdo, SbaGoogleApiData, SbaGooglePlacesLoanData


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

    # ideally we'd use django's REST framework, but for now we just fetch the fields from this sandbox table
    # and convert the DB field names to the field names that the frontend expeccts
    rows = [serialize(row, index) for index, row in enumerate(SbaGooglePlacesLoanData.objects.values(*FIELD_MAP.keys()))]
    result = {
        'status': 'success',
        'data': rows
    }
    return JsonResponse(result)

def serialize(row, index):
    """Returns a dict serialization of the given object, including only fields the client needs"""
    result = {}

    for key in FIELD_MAP:
        result[FIELD_MAP[key]] = row[key]

    result['id'] = index

    return result

FIELD_MAP = {
    'dstklatitude': 'latitude',
    'dstklong': 'longitude',
    'googlerating': 'google_rating',
    'borrname': 'borr_name',
    'borrcity': 'borr_city',
    'borrzip': 'borr_zip',
    'deliverymethod': 'delivery_method',
    'projectcounty': 'project_county',
    'congressionaldistrict': 'congressional_district',
    'grossapproval': 'gross_approval',
    'jobssupported': 'jobs_supported',
    'approvalfiscalyear': 'year'
}
