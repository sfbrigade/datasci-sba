from django.db import connection
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

import random

from api_server.models import SbaRegionLevel, SbaSfdo, SbaGoogleApiData


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
    rows = [serialize(row) for row in SbaGoogleApiData.objects.select_related('sba_sfdo').all()]
    result = {
        'status': 'success',
        'data': rows
    }
    return JsonResponse(result)


def serialize(sba_google_api_data):
    """Returns a dict serialization of the given object, including only fields the client needs"""
    result = {}

    # we're basically combining fields from 2 different joined tables, and massaging the field names
    # a bit to match what our API definition expects.
    # TODO: when we add in Django REST framework, this should be handled by a real serializer

    # copy some keys from the sba_google_api_data table
    for key in ['latitude', 'longitude', 'google_rating']:
        result[key] = getattr(sba_google_api_data, key)

    # copy some keys from the sba_sfdo table
    for key in ['borr_name', 'borr_city', 'borr_zip', 'delivery_method', 'project_county',
                'congressional_district', 'jobs_supported', 'gross_approval']:
        result[key] = getattr(sba_google_api_data.sba_sfdo, key)

    # a couple special cases for fields that need to be rename or run some function on the data
    result['id'] = sba_google_api_data.sba_sfdo.sba_sfdo_id
    if sba_google_api_data.sba_sfdo.first_disbursement_date is not None:
        result['year'] = sba_google_api_data.sba_sfdo.first_disbursement_date.year

    return result