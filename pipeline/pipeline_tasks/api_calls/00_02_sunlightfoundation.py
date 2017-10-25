#!/usr/bin/env python3

# -*- coding: utf-8 -*-
"""
Created on Fri Aug 18 17:50:00 2017

@author: makfan
"""

import argparse
import os
import re
import pandas as pd
import urllib.request

from utilities.db_manager import DBManager

def get_args():
    """ Use argparse to parse command line arguments. """
    parser = argparse.ArgumentParser(description='Congressional District Updater')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()

def get_zips(dbm):
    """ Ideally get the zips from the stg_analytics.sba_sfdo_zips table """
    query = "SELECT zipcode FROM stg_analytics.sba_sfdo_zips ORDER BY zipcode"
    return dbm.load_query_table(query)

def get_districts_for_zip(request_domain, zip):
    zip_api = request_domain + "/districts/locate?zip=" + zip
    try:
        webpage = urllib.request.urlopen(zip_api)
        content = webpage.read().decode("utf-8")
        return content
        
    except:
        print("Problem getting district, returning")
        return None

def parse_result_string(str):
    retval = {}
    """ {"results":[{"state":"CA","district":14}],"count":1} """
    m = re.search('{\"results\":(.*),\"count\":([0-9]+)}', str)
    if m:
        retval['count'] = int(m.group(2))
        res_str = m.group(1)
        d = re.search("\[(.*)\]", res_str)
        if d:
            final_res = []
            blocks = d.group(1)
            matches = re.findall("{\"state\":\"(\w+)\",\"district\":([0-9]+)},?", blocks)
            for match in matches:
                new_dict = {'state':match[0],'district':match[1]}
                final_res.append(new_dict)
            retval['results'] = final_res
            return retval
        else:
            return None
    else:
        return None

def main():
    print('Updating congressional districts')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    
    zips = get_zips(dbm)
    zipcodes = zips.zipcode

    request_domain = "https://congress.api.sunlightfoundation.com"

    single_district = 0
    zero_district = 0
    multi_district = 0
    for zip in zipcodes:
        districts = get_districts_for_zip(request_domain, zip)
        if districts is None:
            print("ZIP {} not found".format(zip))
            continue
        districts = parse_result_string(districts)
        if districts is None:
            continue
        count = districts['count']
        if count != 1:
            if count == 0:
                zero_district += 1
            else:
                multi_district += 1
            print("ZIP {} belongs to {} districts. Not processed.".format(zip, count))
            continue
        single_district += 1
        results = districts['results']
        for dist in results:
            state = results[0]['state']
            number = results[0]['district']
            print("ZIP {} district {}-{}".format(zip, state, number))

    total_districts = single_district + zero_district + multi_district
    pct_single = 0.0
    if total_districts > 0:
        pct_single = 1.0 * single_district / total_districts
    print("Completed. Found {} zip codes, of which {} ({:05.2f}%) are single district.".format(total_districts, single_district, pct_single * 100.0))
    
if __name__ == '__main__':
    main()

