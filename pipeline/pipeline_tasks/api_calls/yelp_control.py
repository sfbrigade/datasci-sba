"""
Control functions for Yelp external API
"""
import os

import pandas as pd
import requests

from utilities.db_manager import DBManager


def check_credentials():
    # Check that all required envars are set.
    try:
        if os.environ['YELP_ID'] is None:
            return False
        if os.environ['YELP_SECRET'] is None:
            return False
    except:
        return False
    return True


def get_params(max_records, older_than):
    # Set the parameters for Yelp. The maximum number of queries per day is 50,000.
    # We can only store the data for 14 days.
    # The user can specify values on the command line, but only values smaller than the max are honored.
    
    params = { 'max_records': 50000, 'max_days_to_store': 14 }
    if max_records > 0:
        params["max_records"] = min(params["max_records"], max_records)
    if older_than > 0:
        params["max_days_to_store"] = min(params["max_days_to_store"], older_than)
    return params


def get_record_ids(params):
    max_records = params['max_records']
    max_days_to_store = params['max_days_to_store']
    db_url = params['db_url']
    print("Return up to {} records that have not been updated in at least {} days.".format(max_records, max_days_to_store))

    dbm = DBManager(db_url=db_url)
    # TODO call load_query_table to get only the desired record IDS
    records = []
    
    for i in range(1, max_records + 1):
        records.append(i)
    return records


def process_ids(params, records):
    # This function is the most complex as it needs to get a pandas dataframe, query yelp and write the updates back to the DB.

    print("Enter process_ids for {} records.".format(len(records)))

    db_url = params['db_url']

    dbm = DBManager(db_url=db_url)

    # Use load_query_table to get only the desired records
    sfdo = dbm.load_table('sba_sfdo', 'stg_analytics')
    sfdo = sfdo[['sba_sfdo_id',
                 'borr_name',
                 'borr_street',
                 'borr_city',
                 'borr_state',
                 'borr_zip',
    ]]
    sfdo['full_address'] = sfdo['borr_street'] + ', '\
                           + sfdo['borr_city'] + ', '\
                           + sfdo['borr_state'] + ', '\
                           + sfdo['borr_zip']

    data = { 'grant_type' : 'client_credentials',
             'client_id' : os.environ['YELP_ID'],
             'client_secret' : os.environ['YELP_SECRET'] }
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    access_token = token.json()['access_token']
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = { 'Authorization' : 'bearer %s' % access_token }

    sfdo['yelp_rating'] = None
    sfdo['yelp_total_reviews'] = None
    sfdo['yelp_url'] = None

    for i in range(len(sfdo)):
        address = sfdo.loc[i]['full_address']
        name = sfdo.loc[i]['borr_name']
        params = { 'location' : address,
                   'term' : name,
                   'radius' : 100,
                   'limit' : 1 }
        resp = requests.get(url=url, params=params, headers=headers)
        try:
            bus = resp.json()['businesses'][0]
            sfdo.loc[i, 'yelp_rating'] = bus['rating']
            sfdo.loc[i, 'yelp_total_reviews'] = bus['review_count']
            sfdo.loc[i, 'yelp_url'] = bus['url']
            print("Found a Yelp match for name {} at address {} returned rating {} reviews {} url {}".
                  format(name, address, bus['rating'], bus['review_count'], bus['url']))
        except:
            print("Didn't find a Yelp match for name {} at address {}".format(name, address))
            pass
        if i > 20:
            break

    # TODO - actually update the database

    # TODO - return something other than None
    
    return None
