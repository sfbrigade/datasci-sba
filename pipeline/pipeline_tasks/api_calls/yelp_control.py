"""Control functions for Yelp external API

Implements methods as required by the
pipeline/pipeline_api_controller.py script.

Has all knowledge of the Yelp API security requirements, limitations
and how the data is stored.  Depends on the sba_sfdo_api_calls table
being in place with one record for each record in the sba_sfdo table.

"""
import os
import sys

import time
import datetime

import pandas as pd
import requests


from utilities.db_manager import DBManager

"""Check that all required envars are set. Returns true if envars are
set, false otherwise.  

NOTE: Does not validate that the envar actually allows API access.
"""
def check_credentials(args):
    try:
        if args.yelp_id is None and os.environ['YELP_ID'] is None:
            return False
        if args.yelp_secret is None and os.environ['YELP_SECRET'] is None:
            return False
    except:
        return False
    return True


"""Set the parameters for Yelp. The maximum number of queries per day
is 50,000.  We can only store the data for 14 days.  The user can
specify values on the command line, but only values smaller than the
max are honored.  Returns params in a dictionary.
"""
def get_params(max_records, older_than):
    params = { 'max_records': 50000, 'max_days_to_store': 14 }
    if max_records > 0:
        params['max_records'] = min(params['max_records'], max_records)
    if older_than > 0:
        params['max_days_to_store'] = min(params['max_days_to_store'], older_than)
    return params


"""This actually gets the records to update, calls the API function
and writes back to the database.  Returns the number of records
updated, or None if a serious error occurred.  Can return 0 if nothing
found to update.
"""
def update_records(args, api_params, db_params):
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

    update_count = update_yelp(args, sfdo_update)
    if update_count is not None:
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


"""This method will erase all the timestamps for the API.  The effect
is that the batch update process will then need to update every
record.
"""
def reset_timestamp(db_params):
    print('......Clear all Yelp timestamps')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['yelp_timestamp'] = pd.to_datetime('None', errors='coerce')
    sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
    dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)

    
"""This method will erase all the stored data for the API. Use with caution."""
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

    
"""Escapes quote characters in a string. Internal only."""
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


"""Creates a timestamp string. Internal only."""
def get_timestamp():
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    return st

    
"""Returns a pandas dataframe with all the records to be updated. Internal only."""
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
    sfdo['yelp_timestamp'] = pd.to_datetime(sfdo['yelp_timestamp'], errors='coerce')
    return sfdo


"""Returns a pandas dataframe with all the current records in the API
table.  Internal only.
"""
def get_all_records(dbm):
    sfdo = dbm.load_table('sba_sfdo_api_calls', 'stg_analytics')
    return sfdo


"""This gets the Yelp data using the API and adds it to the
dataframe. Internal only.
"""
def update_yelp(args, sfdo_update):
    if args.yelp_id:
        yelp_id = args.yelp_id
    else:
        yelp_id = os.environ['YELP_ID']
    if args.yelp_secret:
        yelp_secret = args.yelp_secret
    else:
        yelp_secret = os.environ['YELP_SECRET']
    data = { 'grant_type' : 'client_credentials',
             'client_id' : yelp_id,
             'client_secret' : yelp_secret }
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    access_token = token.json()['access_token']
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = { 'Authorization' : 'bearer %s' % access_token }

    update_count = 0
    pct_complete = -1
    total_records = len(sfdo_update)
    print('......Contacting Yelp')
    i = 0
    for index, row in sfdo_update.iterrows():
        # https://stackoverflow.com/questions/3002085/python-to-print-out-status-bar-and-percentage
        my_pct = 100 * i // total_records
        if my_pct > pct_complete:
            five_pct = my_pct // 5
            if five_pct > (pct_complete // 5):
                sys.stdout.write('\r')
                sys.stdout.write('%-20s %3d%%' % ('.'*five_pct, 5*five_pct))
                sys.stdout.flush()
            pct_complete = my_pct
        address = row.full_address
        name = row.borr_name
        params = { 'location' : address,
                   'term' : name,
                   'radius' : 100,
                   'limit' : 1 }
        resp = requests.get(url=url, params=params, headers=headers)
        try:
            bus = resp.json()['businesses'][0]
            sfdo_update.loc[index, 'yelp_rating'] = bus['rating']
            sfdo_update.loc[index, 'yelp_total_reviews'] = int(bus['review_count'])
            sfdo_update.loc[index, 'yelp_url'] = bus['url']
            sfdo_update.loc[index, 'yelp_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            update_count += 1
        # TODO should determine the types of exceptions and write more
        # specific handlers. If there is a configuration related
        # exception, we should abort and return None so no database
        # write is attempted. An exception because an address or name
        # doesn't find a match should be treated as an attempt
        # (including a timestamp update) so we don't get into a race
        # condition and attempt the same bad address or name lookup
        # each time the script runs.
        except:
            sfdo_update.loc[index, 'yelp_rating'] = 0.0
            sfdo_update.loc[index, 'yelp_total_reviews'] = 0
            sfdo_update.loc[index, 'yelp_url'] = ''
            sfdo_update.loc[index, 'yelp_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            pass
        i = i + 1

    sys.stdout.write('\r')
    sys.stdout.write('%-20s 100%%\n' % ('.'*20))
    sys.stdout.flush()
    return update_count
