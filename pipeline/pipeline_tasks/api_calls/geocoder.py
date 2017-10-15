"""
Geocoding Utility:
"""
import os

import pandas as pd
import sqlalchemy as sqla
from sqlalchemy import create_engine

from geopy import GoogleV3
from utilities.db_manager import DBManager

SBA_DWH = os.getenv('SBA_DWH')
engine = create_engine(SBA_DWH)
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API')


def geocode_address(address, api_key=GOOGLE_MAPS_API_KEY):
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


def geocode_table(df):
    """Add Geocoded columns to df

    Keyword Args:
    df: Dataframe which must have an "full_address" column with a clean address
    api_key: Google Places API Key
    """
    # make list of latitudes and longitudes for each address using list comprehension
    latitudes_longitudes = []
    i = 0
    for address in df.full_address:
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
    return df
