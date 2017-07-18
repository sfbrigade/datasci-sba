"""
Geocoding Utility:
We'll be using this: https://github.com/slimkrazy/python-google-places#python-google-places
to geocode addresses.
"""
import os

import pandas as pd

from geopy import GoogleV3

def geocode(df):
    """Add Geocoded columns to df
    Keyword Args:
    df: Dataframe which must have an "address" column with a clean address
    api_key: Google Places API Key
    """
    geolocator = GoogleV3()
    latitudes = []
    longitudes = []

    # This counter is just for debugging purposes since I don't want to hit the API threshold
    i = 0
    for place in df.address:
        print(place)
        print(i)
        query_result = geolocator.geocode(place)

        if query_result == None:
            # address not found
            # tries a new address by cutting off at the first comma, getting rid of secondary address unit
            new_address = df.borr_street[i].split(',')[0] + ', ' + df.borr_city[i] + ', ' \
                          + df.borr_state[i] + ', ' + str(df.borr_zip[i])
            query_result = geolocator.geocode(new_address)

        if query_result != None:
            print(query_result.latitude, query_result.longitude)
            latitudes.append(query_result.latitude)
            longitudes.append(query_result.longitude)
        else:
            print("Address Not Found")
            latitudes.append(None)
            longitudes.append(None)

        i = i + 1
        if i == 10:
            break

    for i in range(len(latitudes), len(df)):
        latitudes.append(None)
        longitudes.append(None)
    df['latitudes'] = latitudes
    df['longitudes'] = longitudes

    return df
