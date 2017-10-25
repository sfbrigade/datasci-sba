"""
Control functions for Geocode external API
"""
import os

import pandas as pd
import requests


from utilities.db_manager import DBManager



# Check that all required envars are set. Returns true if envars are set, false otherwise.
# NOTE: Does not validate that the envar value actually allows API access.
def check_credentials():
    try:
        if os.environ['GOOGLE_MAPS_API'] is None:
            return False
    except:
        return False
    return True


# Set the parameters for Google Maps. The maximum number of queries per day is 25,000.
# We will store the data no more than 21 days.
# The user can specify values on the command line, but only values smaller than the max are honored.
# Returns params in a dictionary.
def get_params(max_records, older_than):
    params = { 'max_records': 25000, 'max_days_to_store': 30 }
    if max_records > 0:
        params["max_records"] = min(params["max_records"], max_records)
    if older_than > 0:
        params["max_days_to_store"] = min(params["max_days_to_store"], older_than)
    return params


# This actually gets the records to update, calls the API function and writes back to the database.
# Returns the number of records updated, or None if a serious error occurred.
# Can return 0 if nothing found to update.
def update_records(api_params, db_params):
    # TODO TODO TODO
    return None


# This is internal only, returning a pandas dataframe with the records to be updated.
def get_records(dbm, max_records, max_days_to_store):
    # TODO TODO TODO
    return None


# This is internal only to actually get the Google Maps geocode data and add it to
# the dataframe.
def update_geocode(sfdo):
    # TODO TODO TODO
    update_count = 0
    return update_count

