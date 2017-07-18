"""
Geocoding Utility:
We'll be using this: https://github.com/slimkrazy/python-google-places#python-google-places
to geocode addresses.
"""
import os

import pandas as pd

from geopy.geocoders import Google V3

YOUR_API_KEY = os.getenv('GOOGLE_PLACES_API')


def geocode(df, api_key=YOUR_API_KEY):
    """Add Geocoded columns to df
    Keyword Args:
    df: Dataframe which must have an "address" column with a clean address
    api_key: Google Places API Key
    """
    geolocator = GoogleV3(api_key = api_key)
    latitudes = []
    longitudes = []

    # This counter is just for debugging purposes since I don't want to hit the API threshold
    i = 0
    for place in df.address:
        print(place)
        print(i)
        query_result = geolocator.geocode(place)

        print(query_result.latitude, query_result.longitude)
        latitudes.append(query_result.latitude)
        longitudes.append(query_result.longitude)
        i = i + 1
        if i == 10:
            break

    for i in range(len(latitudes), len(df)):
        latitudes.append(None)
        longitudes.append(None)
    df['latitudes'] = latitudes
    df['longitudes'] = longitudes

    return df
