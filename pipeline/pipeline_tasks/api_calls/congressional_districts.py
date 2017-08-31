"""Hit Google Civic API to get congressional districts"""

import os

import requests


def get_congressional_dist_by_addr(df):
    """
    Get Contressional District from Google Maps

    Keyword Args:
      df: DataFrame with business information to request congressional districts
    """

    # TODO
    # Build data: Needs key from API envar, address built from the database.

    url = 'https://www.googleapis.com/civicinfo/v2/representatives'

    for i in range(len(df)):
        address = df.loc[i]['full_address']
        params = { 'key': os.environ['GOOGLE_STATIC_MAPS_API'], 'address': address }

        resp = requests.get(url=url, params=params)

        try:
            # TODO - parse the resp to get the congressional district and save in the DB
            results = resp.json()
            # Need the divisions field and then the state and cd fields from that.

        except:
            pass

        if i > 9:
            break

    return df
