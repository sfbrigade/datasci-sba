from django.db import connection
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

    # We basically want to join the sba_sfdo table with sba__google_places_loan_data.
    # But for the MVP, since we're keeping the latter table separate in the 'sandbox' schema and there's
    # no foreign key connecting the two tables, we can't easily use the django model, so do a raw query instead
    with connection.cursor() as cursor:
        cursor.execute("""SELECT
            sba_sfdo.sba_sfdo_id AS id,
            sba_sfdo.borr_name,
            sba_sfdo.borr_city,
            sba_sfdo.borr_zip,
            sba_sfdo.delivery_method,
            sba_sfdo.project_county,
            sba_sfdo.congressional_district,
            sba_sfdo.jobs_supported,
            sba_sfdo.gross_approval,
            sba__google_places_loan_data.dstklatitude AS latitude,
            sba__google_places_loan_data.dstklong AS longitude,
            sba__google_places_loan_data.googlerating AS google_rating,
            extract(year from first_disbursement_date) AS year
            FROM sba_sfdo
            LEFT JOIN sba__google_places_loan_data
            ON UPPER(sba_sfdo.borr_name) = UPPER(sba__google_places_loan_data.borrname)
        """)

        # if we just did 'rows = cursor.fetchall()' each row would be an array; use the cursor's description
        # to build a dict from each row instead
        desc = cursor.description
        rows = [ dict(zip([col[0] for col in desc], row)) for row in cursor.fetchall() ]

    result = {
        'status': 'success',
        'data': rows
    }
    return JsonResponse(result)