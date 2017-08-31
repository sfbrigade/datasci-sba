"""
This script scrapes Yelp data and obtains the Yelp rating, number of reviews,
and url for each business.

The output of this table is spit into a table: 'stg_analytics.sba_sfdo_api_calls'

Note that we need to make sure addresses have been cleaned
(particularly the city name) to ensure optimal results.
"""

import argparse
import os

import pandas as pd
import requests
from sqlalchemy import create_engine

from utilities.db_manager import DBManager
from pipeline.pipeline_tasks.api_calls import yelp_ratings as yr
from pipeline.pipeline_tasks.api_calls import congressional_districts as cd


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()


def get_yelp_fields(dbm):
    """
    Get Yelp Fields using helper modules defined in api_calls

    Write results to stg_analytics.sba_sfdo_api_calls

    Keyword Args:
        dbm: DBManager object
    """
    print('Getting Yelp ratings.')
    sfdo = dbm.load_table('sba_sfdo', 'stg_analytics')
    sfdo = sfdo[[
        'sba_sfdo_id',
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
    return yr.get_yelp_ratings(sfdo)


def get_geocoded_fields(dbm):
    """
    Get geocoded fields using helper modules defined in api_calls

    Keyword Args:
        dbm: DBManager object
    """
    pass


def get_congressional_districts(dbm):
    """
    Get Congressional Districts fields using helper modules defined in api_calls

    Keyword Args:
        dbm: DBManager object
    """
    print('Getting Congressional Districts from Google Civic Info API')
    sfdo = dbm.load_table('sba_sfdo', 'stg_analytics')
    sfdo = sfdo[[
        'sba_sfdo_id',
        'borr_street',
        'borr_city',
        'borr_state',
        'borr_zip',
    ]]
    sfdo['full_address'] = sfdo['borr_street'] + ', '\
                           + sfdo['borr_city'] + ', '\
                           + sfdo['borr_state'] + ', '\
                           + sfdo['borr_zip']

    print('I AM HERE')
    return cd.get_congressional_dist_by_addr(sfdo)


def main():
    """Execute Stuff"""
    print('Getting Data from External APIs (Yelp, Google Civic Info, etc.')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)

    sfdo_yelp = get_yelp_fields(dbm)

    sfdo_congressional = get_congressional_districts(dbm)

    # Eventually we will have to join with geocoded fields table and
    # Congressional District Table before writing back to DB
    # TODO - need to join sfdp_yelp and sfdo_congressional and save that joined copy
    dbm.write_df_table(
        sfdo_yelp, table_name='sba_sfdo_api_calls', schema='stg_analytics')


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()
