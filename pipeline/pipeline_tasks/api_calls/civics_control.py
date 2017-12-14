"""Control functions for Google Civics external API

Implements methods as required by the
pipeline/pipeline_api_controller.py script.

Has all knowledge of the Google Civics API security requirements,
limitations and how the data is stored.  Depends on the
sba_sfdo_api_calls table being in place with one record for each
record in the sba_sfdo table.

"""
import os
import re
import sys

import time
import datetime

import pandas as pd
import requests


from utilities.db_manager import DBManager


"""Check that all required envars are set. Returns true if envars are
set, false otherwise.  

NOTE: Does not validate that the envar value actually allows API access.
"""
def check_credentials(args):
    try:
        if args.civics_key is None and os.environ['GOOGLEAPI'] is None:
            return False
    except:
        return False
    return True


"""Set the parameters for Google Civics. The maximum number of queries
per day is 25,000.  We can only store the data for 21 days.  The user
can specify values on the command line, but only values smaller than
the max are honored.  Returns params in a dictionary.
"""
def get_params(max_records, older_than):
    params = { 'max_records': 25000, 'max_days_to_store': 21 }
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
    # Then call the Google Civics API for each entry in the dataframe and update if it works.
    max_records = api_params['max_records']
    max_days_to_store = api_params['max_days_to_store']
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    
    sfdo_update = get_records(dbm, max_records, max_days_to_store)
    if sfdo_update is None:
        return None
    elif len(sfdo_update) < 1:
        return 0

    update_count = update_google_civics(args, sfdo_update)
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
        print('......Save Civics data updates')
        dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)
        
    return update_count


"""This method will erase all the timestamps for the API.  The effect
is that the batch update process will then need to update every
record.
"""
def reset_timestamp(db_params):
    print('......Clear all Civics timestamps')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['civics_timestamp'] = pd.to_datetime('None', errors='coerce')
    sfdo_orig = sfdo_orig.set_index('sba_sfdo_id')
    dbm.write_df_table(sfdo_orig, table_name='sba_sfdo_api_calls', schema='stg_analytics', index=True)

    
"""This method will erase all the stored data for the API. Use with caution."""
def clear_data(db_params):
    print('......Clear all Civics data')
    db_url = db_params['db_url']
    dbm = DBManager(db_url=db_url)
    sfdo_orig = get_all_records(dbm)
    sfdo_orig['civics_district'] = None
    sfdo_orig['civics_timestamp'] = pd.to_datetime('None', errors='coerce')
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
    query = "SELECT sba_sfdo.sba_sfdo_id as sba_sfdo_id, sba_sfdo.borr_name, sba_sfdo.borr_street, sba_sfdo.borr_city, sba_sfdo.borr_state, sba_sfdo.borr_zip, civics_district, civics_timestamp FROM stg_analytics.sba_sfdo LEFT JOIN stg_analytics.sba_sfdo_api_calls ON sba_sfdo.sba_sfdo_id=sba_sfdo_api_calls.sba_sfdo_id WHERE civics_timestamp is NULL OR civics_timestamp <= '{}' ORDER BY civics_timestamp LIMIT {}".format(st, max_records)
    sfdo = dbm.load_query_table(query)
    sfdo['full_address'] = sfdo['borr_street'] + ', '\
                           + sfdo['borr_city'] + ', '\
                           + sfdo['borr_state'] + ', '\
                           + sfdo['borr_zip']
    sfdo['civics_timestamp'] = pd.to_datetime(sfdo['civics_timestamp'], errors='coerce')
    return sfdo


"""Returns a pandas dataframe with all the current records in the API
table.  Internal only.
"""
def get_all_records(dbm):
    sfdo = dbm.load_table('sba_sfdo_api_calls', 'stg_analytics')
    return sfdo


"""This gets the Google Civics data and adds it to the
dataframe. Internal only.
"""
def update_google_civics(args, sfdo_update):
    if args.civics_key:
        key = args.civics_key
    else:
        key = os.environ['GOOGLEAPI']
    url = 'https://www.googleapis.com/civicinfo/v2/representatives'

    update_count = 0
    pct_complete = -1
    total_records = len(sfdo_update)
    print('......Contacting Google Civics')
    i = 0
    for index, row in sfdo_update.iterrows():
        # https://stackoverflow.com/questions/3002085/python-to-print-out-status-bar-and-percentage
        my_pct = 100 * i // total_records;
        if my_pct > pct_complete:
            five_pct = my_pct // 5;
            if five_pct > (pct_complete // 5):
                sys.stdout.write('\r')
                sys.stdout.write('%-20s %3d%%' % ('.'*five_pct, 5*five_pct))
                sys.stdout.flush()
            pct_complete = my_pct
        address = row.full_address
        params = { 'address' : address,
                   'includeOffices' : False,
                   'key' : key }
        resp = requests.get(url=url, params=params)
        try:
            civics = resp.json()
            divisions = civics['divisions']
            # Since we don't name what the field will look like, we have to regexp match to get the district.
            # Store district string as 'st-nn' and store at-large as st-00
            prog = re.compile('ocd-division/country:us/state:([a-z][a-z])/cd:([0-9]+)')
            found = False
            cong_district = ''
            for nm in divisions:
                result = prog.search(nm)
                if result:
                    state = result.group(1)
                    district = result.group(2)
                    cong_district = state + '-' + str(district).zfill(2)
                    found = True
                    break
            if not found:
                # For states with a single at-large district, we have
                # to look at the state and find the 'alsoKnownAs'
                # entry.
                prog = re.compile('ocd-division/country:us/state:([a-z][a-z])')
                for nm in divisions:
                    result = prog.search(nm)
                    if result:
                        state = result.group(1)
                        val = divisions[nm]
                        aka = val['alsoKnownAs'][0]
                        result = re.search('ocd-division/country:us/state:([a-z][a-z])/cd:([0-9]+)', aka)
                        if result:
                            new_state = result.group(1)
                            new_district = result.group(2)
                            if state == new_state:
                                cong_district = state + '-' + '00'
                                found = True
                                break
                            else:
                                print('Warning: state mistmatch {} != {}'.format(state, new_state))
            if found:
                sfdo_update.loc[index, 'civics_district'] = cong_district
                sfdo_update.loc[index ,'civics_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
                update_count += 1
            else:
                sfdo_update.loc[index, 'civics_district'] = ''
                sfdo_update.loc[index, 'civics_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
        # TODO should determine the types of exceptions and write more
        # specific handlers. If there is a configuration related
        # exception, we should abort and return None so no database
        # write is attempted. An exception because an address or name
        # doesn't find a match should be treated as an attempt
        # (including a timestamp update) so we don't get into a race
        # condition and attempt the same bad address or name lookup
        # each time the script runs.
        except:
            sfdo_update.loc[index, 'civics_district'] = ''
            sfdo_update.loc[index, 'civics_timestamp'] = pd.to_datetime(get_timestamp(), errors='coerce')
            pass
        i = i + 1

    sys.stdout.write('\r')
    sys.stdout.write('%-20s 100%%\n' % ('.'*20))
    sys.stdout.flush()
    return update_count
