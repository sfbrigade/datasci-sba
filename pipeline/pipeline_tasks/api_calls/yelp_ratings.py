"""Hit Yelp API to get Yelp ratings"""
import os

import requests


def get_yelp_ratings(df):
    """
    Get Yelp Ratings

    Keyword Args:
        df: DataFrame with business information to get Yelp
            data for
    """
    data = {'grant_type': 'client_credentials',
            'client_id': os.environ['YELP_ID'],
            'client_secret': os.environ['YELP_SECRET']}
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    access_token = token.json()['access_token']
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': 'bearer %s' % access_token}

    df['yelp_rating'] = None
    df['yelp_total_reviews'] = None
    df['yelp_url'] = None

    for i in range(len(df)):
        address = df.loc[i]['full_address']
        name = df.loc[i]['borr_name']
        params = {'location': address,
                  'term': name,
                  'radius': 100,
                  'limit': 1}

        resp = requests.get(url=url, params=params, headers=headers)

        try:
            df.loc[i, 'yelp_rating'] = resp.json()['businesses'][0]['rating']
            df.loc[i, 'yelp_total_reviews'] = resp.json()['businesses'][0]['review_count']
            df.loc[i, 'yelp_url'] = resp.json()['businesses'][0]['url']
        except:
            pass
    return df
