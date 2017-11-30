"""Control functions for Geocode external API

Implements methods as required by the
pipeline/pipeline_api_controller.py script.

Has all knowledge of the Google Maps security requirements,
limitations and how the data is stored.  Depends on the
sba_sfdo_api_calls table being in place with one record for each
record in the sba_sfdo table.

"""
import os
import sys

import time
import datetime

import numpy as np

import pandas as pd
import requests


import geopy
from utilities.db_manager import DBManager



# Check that all required envars are set. Returns true if envars are set, false otherwise.
# NOTE: Does not validate that the envar value actually allows API access.
def check_credentials(args):
    try:
        if args.geocode_key is None and os.environ['GOOGLE_MAPS_API'] is None:
            return False
    except:
        return False
    return True


# Set the parameters for Google Maps. The maximum number of queries per day is 25,000.
# We will store the data no more than 21 days.
# The user can specify values on the command line, but only values smaller than the max are honored.
# Returns params in a dictionary.
def get_params(max_records, older_than):
    params = { 'max_records': 2500, 'max_days_to_store': 30 }
    if max_records > 0:
        params['max_records'] = min(params['max_records'], max_records)
    if older_than > 0:
        params['max_days_to_store'] = min(params['max_days_to_store'], older_than)
    return params


# This actually gets the records to update, calls the API function and writes back to the database.
# Returns the number of records updated, or None if a serious error occurred.
# Can return 0 if nothing found to update.
def update_records(args, api_params, db_params):
    # Create a DB manager object and a pandas dataframe with just the set of records to be updated.
    # Then call the Google Maps API for each entry in the dataframe and update if it works.
    max_records = api_params['max_records']
    max_days_to_store = api_params['max_days_to_store']
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)

    sfdo_update = get_records(dbm, max_records, max_days_to_store)
    if sfdo_update is None:
        return None
    elif len(sfdo_update) < 1:
        return 0

    update_count = update_geocode(args, sfdo_update)
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
        print('......Save Geocode data updates')
        dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)

    return update_count


# This method will erase all the timestamps for the API.  The effect
# is that the batch update process will then need to update every
# record.
def reset_timestamp(db_params):
    print('......Clear all Google Geocode timestamps')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['geocode_timestamp'] = pd.to_datetime('None', errors='coerce')
    sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
    dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)


# This method will erase all the stored data for the API. Use with caution.
def clear_data(db_params):
    print('......Clear all Google Geocode data')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['geocode_lat'] = np.nan
    sfdo_orig['geocode_long'] = np.nan
    sfdo_orig['geocode_timestamp'] = pd.to_datetime('None', errors='coerce')
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
    query = "SELECT sba_sfdo.sba_sfdo_id as sba_sfdo_id, sba_sfdo.borr_name, sba_sfdo.borr_street, sba_sfdo.borr_city, sba_sfdo.borr_state, sba_sfdo.borr_zip, geocode_lat, geocode_long, geocode_timestamp FROM stg_analytics.sba_sfdo LEFT JOIN stg_analytics.sba_sfdo_api_calls ON sba_sfdo.sba_sfdo_id=sba_sfdo_api_calls.sba_sfdo_id WHERE geocode_timestamp is NULL OR geocode_timestamp <= '{}' ORDER BY civics_timestamp LIMIT {}".format(st, max_records)
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


# This is internal only to actually get the Google Maps geocode data and add it to
# the dataframe.
def update_geocode(args, sfdo_update):
    if args.geocode_key:
        api_key = args.geocode_key
    else:
        api_key = os.environ['GOOGLE_MAPS_API']
    geolocator = geopy.GoogleV3(api_key=api_key)
    update_count = 0
    pct_complete = -1
    total_records = len(sfdo_update)
    print('......Contacting Google Geocode')
    failures = 0
    max_failures = 10
    i = 0
    while i < total_records:
        # https://stackoverflow.com/questions/3002085/python-to-print-out-status-bar-and-percentage
        my_pct = 100 * i // total_records;
        if my_pct > pct_complete:
            five_pct = my_pct // 5;
            if five_pct > (pct_complete // 5):
                sys.stdout.write('\r')
                sys.stdout.write('%-20s %3d%%' % ('.'*five_pct, 5*five_pct))
                sys.stdout.flush()
            pct_complete = my_pct
        address = sfdo_update.loc[i]['full_address']
        try:
            query_result = geolocator.geocode(address)
            if query_result:
                latitude = query_result.latitude
                longitude = query_result.longitude
                sfdo_update.loc[i, 'geocode_lat'] = float(latitude)
                sfdo_update.loc[i, 'geocode_long'] = float(longitude)
                sfdo_update.loc[i, 'geocode_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
                update_count += 1
            else:
                sfdo_update.loc[i, 'geocode_lat'] = np.nan
                sfdo_update.loc[i, 'geocode_long'] = np.nan
                sfdo_update.loc[i, 'geocode_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
        except geopy.exc.GeocoderQuotaExceeded as err:
            sys.stdout.write('\r')
            print('Quota exceeded: {}: No further processing attempted.'.format(err))
            break
        except geopy.exc.ConfigurationError as err:
            sys.stdout.write('\r')
            print('Configuration Error: {}: No further processing attempted.'.format(err))
            break
        except geopy.exc.GeocoderServiceError as err:
            if failures < max_failures:
                failures = failures + 1
                # We want to repeat this record, so don't increment the index
                continue
            else:
                sys.stdout.write('\r')
                print('Geocoder Service Error Encountered {} Times: {}: No further processing attempted.'.
                      format(failures, err))
                break
        except geopy.exc.GeocoderQueryError as err:
            sys.stdout.write('\r')
            print('Geocoder Query Error: {}: No further processing attempted.'.format(err))
            break
        except geopy.exc.GeocoderAuthenticationFailure as err:
            sys.stdout.write('\r')
            print('Geocoder Authentication Failure: {}: No further processing attempted.'.format(err))
            break
        except geopy.exc.GeopyError as err:
            sys.stdout.write('\r')
            print('Exception: {}'.format(err))
            sfdo_update.loc[i, 'geocode_lat'] = np.nan
            sfdo_update.loc[i, 'geocode_long'] = np.nan
            sfdo_update.loc[i, 'geocode_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            pass
        except:
            sys.stdout.write('\r')
            print('Unknown exception occurred')
            sfdo_update.loc[i, 'geocode_lat'] = np.nan
            sfdo_update.loc[i, 'geocode_long'] = np.nan
            sfdo_update.loc[i, 'geocode_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            pass
        # Force a short pause, to minimize the timeout errors.
        time.sleep(1)
        i = i + 1
    sys.stdout.write('\r')
    sys.stdout.write('%-20s 100%%\n' % ('.'*20))
    sys.stdout.flush()
    if failures > 0:
        print('......Reprocessed {} records after failures during processing.'.format(failures))
    return update_count

