"""
This script scrapes Yelp data and obtains the Yelp rating, number of reviews, and url for each business.
The output of this table is spit into a table: 'sba_sfdo_yelp'

**need to make sure addresses have been cleaned (particularly the city name) to ensure optimal results.**
"""

import argparse
import os
import pandas as pd
from utilities.db_manager import DBManager
from utilities import util_functions as uf
import requests
from sqlalchemy import create_engine
import pandas as pd

def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()


def scrape_yelp(dbm):
    """Scrape yelp reviews
    Keyword Args:
        dbm: DBManager object
    """
    data = {'grant_type': 'client_credentials',
            'client_id': os.environ['yelp_id'],
            'client_secret': os.environ['yelp_secret']}
    token = requests.post('https://api.yelp.com/oauth2/token', data=data)
    access_token = token.json()['access_token']
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': 'bearer %s' % access_token}

    sfdo = load_table(self, 'sba_sfdo', 'stg_analytics')
    sfdo['full_address'] = sfdo['borr_street']+', '+sfdo['borr_city']+', '+sfdo['borr_state']+', '+sfdo['borr_zip']
    
    sfdo['yelp_rating'] = None
    sfdo['yelp_total_reviews'] = None
    sfdo['yelp_url'] = None
    
    for i in range(len(sfdo)):
        address = sfdo.iloc[i]['full_address']
        name = sfdo.iloc[i]['borr_name']
        params = {'location': address,
                  'term': name,
                  'radius': 100,
                  'limit':1
                  }
    
        resp = requests.get(url=url, params=params, headers=headers)
    
        try:
            sfdo['yelp_rating'].loc[i] = resp.json()['businesses'][0]['rating']
            sfdo['yelp_total_reviews'].loc[i] = resp.json()['businesses'][0]['review_count']
            sfdo['yelp_url'].loc[i] = resp.json()['businesses'][0]['url']
        except:
            pass

    dbm.write_df_table(
        sfdo, table_name='sba_sfdo_yelp', schema='stg_analytics')

def main():
    """Execute Stuff"""
    print('Scraping Yelp data')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    scrape_yelp(dbm)



if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()
