"""
Geocoding Utility:
"""
import os
import sys
sys.path.append('../')

import pandas as pd
import sqlalchemy as sqla
from sqlalchemy import create_engine

SBA_DWH = os.getenv('SBA_DWH')
engine = create_engine(SBA_DWH)

from geopy import GoogleV3
from utilities.db_manager import DBManager

YOUR_API_KEY = os.getenv('GOOGLE_MAPS_API')


def create_address_column(df):
    """creates a new column on the dataframe for the geocoding address
    Keyword Args:
    address: address
    """
    df['address'] = df.borr_street + ', ' + df.borr_city + ', ' + df.borr_state + ', ' + df.borr_zip.map(str)
    return df


def geocode_address(address, api_key=YOUR_API_KEY):
    """Geocodes a single address

    Keyword Args:
    address: string with the address"""
    geolocator = GoogleV3(api_key=api_key)
    query_result = geolocator.geocode(address)
    if query_result != None:
        latitude = query_result.latitude
        longitude = query_result.longitude
    else:
        latitude = "Not found"
        longitude = "Not found"
    return latitude, longitude


def create_geocode_table(df, dbm):
    """Add Geocoded columns to df

    Keyword Args:
    df: Dataframe which must have an "address" column with a clean address
    api_key: Google Places API Key
    """
    # create table with standarized address column
    df = create_address_column(df)

    # make list of latitudes and longitudes for each address using list comprehension
    latitudes_longitudes = []
    i = 0
    for address in df.address:
        print(i)
        latitudes_longitudes.append(geocode_address(address))
        i += 1
    latitudes = [coordinate[0] for coordinate in latitudes_longitudes]
    longitudes = [coordinate[1] for coordinate in latitudes_longitudes]

    for i in range(len(latitudes), len(df)):
        latitudes.append(None)
        longitudes.append(None)
    df['latitudes'] = latitudes
    df['longitudes'] = longitudes

    dbm.write_df_table(df, table_name='table_with_geocode', schema='api_calls')
    return df


def main():
    """Execute Stuff"""
    print('Geocoding data')
    with engine.begin() as conn:
        df = pd.read_sql_table('sba_sfdo', conn, 'stg_analytics')
    dbm = DBManager(db_url=SBA_DWH)
    create_geocode_table(df, dbm)
    print(df)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()
