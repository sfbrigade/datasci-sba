"""Control functions for Yelp external API

Implements methods as required by the
pipeline/pipeline_api_controller.py script.

Has all knowledge of the Yelp API security requirements, limitations
and how the data is stored.  Depends on the sba_sfdo_api_calls table
being in place with one record for each record in the sba_sfdo table.

"""
import os

import time
import datetime

import pandas as pd
import requests


from utilities.db_manager import DBManager


# Check that all required envars are set. Returns true if envars are set, false otherwise.
# NOTE: Does not validate that the envar actually allows API access.
def check_credentials():
    try:
        if os.environ['YELP_ID'] is None:
            return False
        if os.environ['YELP_SECRET'] is None:
            return False
    except:
        return False
    return True


# Set the parameters for Yelp. The maximum number of queries per day is 50,000.
# We can only store the data for 14 days.
# The user can specify values on the command line, but only values smaller than the max are honored.
# Returns params in a dictionary.
def get_params(max_records, older_than):
    params = { 'max_records': 50000, 'max_days_to_store': 14 }
    if max_records > 0:
        params['max_records'] = min(params['max_records'], max_records)
    if older_than > 0:
        params['max_days_to_store'] = min(params['max_days_to_store'], older_than)
    return params


# This actually gets the records to update, calls the API function and writes back to the database.
# Returns the number of records updated, or None if a serious error occurred.
# Can return 0 if nothing found to update.
def update_records(api_params, db_params):
    # Create a DB manager object and a pandas dataframe with just the set of records to be updated.
    # Then call the Yelp API for each entry in the dataframe and update if it works.
    max_records = api_params['max_records']
    max_days_to_store = api_params['max_days_to_store']
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    
    sfdo_update = get_records(dbm, max_records, max_days_to_store)
    if sfdo_update is None:
        return None
    elif len(sfdo_update) < 1:
        return 0

    update_count = update_yelp(sfdo_update)
    if update_count is not None and update_count > 0:
        sfdo_orig = get_all_records(dbm)
        if sfdo_orig is None:
            return None
        elif len(sfdo_orig) < 1:
            return 0
        sfdo_update.drop('borr_name', axis=1, inplace=True)
        sfdo_update.drop('borr_street', axis=1, inplace=True)
        sfdo_update.drop('borr_city', axis=1, inplace=True)
        sfdo_update.drop('borr_state', axis=1, inplace=True)
        sfdo_update.drop('borr_zip', axis=1, inplace=True)
        sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
        sfdo_update = sfdo_update.set_index('sba_sfdo_id')
        sfdo_orig.update(sfdo_update)
        print('......Save Yelp data updates')
        dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)
        
    return update_count


# This method will erase all the timestamps for the API.  The effect
# is that the batch update process will then need to update every
# record.
def reset_timestamp(db_params):
    print('......Clear all Yelp timestamps')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['yelp_timestamp'] = pd.to_datetime('None', errors='coerce')
    sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
    dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)

    
# This method will erase all the stored data for the API. Use with caution.
def clear_data(db_params):
    print('......Clear all Yelp data')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['yelp_rating'] = 0.0
    sfdo_orig['yelp_total_reviews'] = 0
    sfdo_orig['yelp_url'] = None
    sfdo_orig['yelp_timestamp'] = pd.to_datetime('None', errors='coerce')
    sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
    dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)

    
# Internal only
def escape(str):
    retval = ''
    for letter in str:
        if letter == "'":
            retval += "''"
        elif letter == '"':
            retval += '""'
        else:
            retval += letter
    return retval


# Internal only, to create a timetstamp string.
def get_timestamp():
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    return st

    
# This is internal only, returning a pandas dataframe with the records to be updated.
def get_records(dbm, max_records, max_days_to_store):
    # Build the date/time to compare. Subtract appropriate number of seconds from current time
    ts = time.time()
    ts -= max_days_to_store * 24 * 60 * 60
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
    query = "SELECT sba_sfdo.sba_sfdo_id as sba_sfdo_id, sba_sfdo.borr_name, sba_sfdo.borr_street, sba_sfdo.borr_city, sba_sfdo.borr_state, sba_sfdo.borr_zip, yelp_rating, yelp_total_reviews, yelp_url, yelp_timestamp FROM stg_analytics.sba_sfdo LEFT JOIN stg_analytics.sba_sfdo_api_calls ON sba_sfdo.sba_sfdo_id=sba_sfdo_api_calls.sba_sfdo_id WHERE yelp_timestamp is NULL OR yelp_timestamp <= '{}' ORDER BY yelp_timestamp LIMIT {}".format(st, max_records)
    sfdo = dbm.load_query_table(query)
    sfdo['full_address'] = sfdo['borr_street'] + ', '\
                           + sfdo['borr_city'] + ', '\
                           + sfdo['borr_state'] + ', '\
                           + sfdo['borr_zip']
    
    return sfdo


# This is internal only, returning a pandas dataframe with the current
# contents of the API table.
def get_all_records(dbm):
    sfdo = dbm.load_table('sba_sfdo_api_calls', 'stg_analytics')
    return sfdo


# This is internal only to actually get the Yelp data and add it to
# the dataframe.
def update_yelp(sfdo_update):
    data = { 'grant_type' : 'client_credentials',
             'client_id' : os.environ['YELP_ID'],
             'client_secret' : os.environ['YELP_SECRET'] }
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    access_token = token.json()['access_token']
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = { 'Authorization' : 'bearer %s' % access_token }

    update_count = 0
    print('......Contacting Yelp')
    for i in range(len(sfdo_update)):
        print('.', end='', flush=True)
        address = sfdo_update.loc[i]['full_address']
        name = sfdo_update.loc[i]['borr_name']
        params = { 'location' : address,
                   'term' : name,
                   'radius' : 100,
                   'limit' : 1 }
        resp = requests.get(url=url, params=params, headers=headers)
        try:
            bus = resp.json()['businesses'][0]
            sfdo_update.loc[i, 'yelp_rating'] = bus['rating']
            sfdo_update.loc[i, 'yelp_total_reviews'] = int(bus['review_count'])
            sfdo_update.loc[i, 'yelp_url'] = bus['url']
            sfdo_update.loc[i, 'yelp_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            update_count += 1
        except:
            sfdo_update.loc[i, 'yelp_rating'] = 0.0
            sfdo_update.loc[i, 'yelp_total_reviews'] = 0
            sfdo_update.loc[i, 'yelp_url'] = ''
            sfdo_update.loc[i, 'yelp_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            pass

    print(' ')
    return update_count
