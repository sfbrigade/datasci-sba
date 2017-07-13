"""
Script to batch run tasks
"""

import argparse

import subprocess

import datetime as dt

import pandas as pd
import os

from utilities import sql_utils
from utilities.db_manager import DBManager

from pandas.io.sql import SQLTable


RUNTIME_ID = str(dt.datetime.now())
SQL_PATH = os.path.join(os.path.dirname(__file__), 'pipeline_tasks')

# Initialize runtime tracking
starttime = dt.datetime.now()


def _execute_insert(self, conn, keys, data_iter):
    """Optional, but useful: helps Pandas write tables against Postgres much faster.
    See https://github.com/pydata/pandas/issues/8953 for more info
    """
    print("Using monkey-patched _execute_insert")
    data = [dict((k, v) for k, v in zip(keys, row)) for row in data_iter]
    conn.execute(self.insert_statement().values(data))

SQLTable._execute_insert = _execute_insert


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', type=str, required=True)
    parser.add_argument('--runtime_id', help='Run Time ID', type=str, default=RUNTIME_ID)
    return parser.parse_args()


def run_files(dbm, files, db_url):
    """Given a list of SQL or Python Files, run tasks in order.

    Keyword arguments:
    dbm -- Database Manager Object to help us read/write queries to tables
    files -- List of files containing SQL queries to run against the DWH
    db_url -- DB URL to Database
    """

    localstarttime = dt.datetime.now()

    for file in files:
        if file[-3:] == '.py':
            p = subprocess.Popen(['python3', '-m',
                                  'pipeline.pipeline_tasks.{}'.format(file[:-3]),
                                  '--db_url={}'.format(db_url)])
            p.communicate()
            print("Done running the python file {}".format(file))
        else:
            #p = subprocess.Popen(['psql', '-d', db_url, '-a', '-f',
            #                      './pipeline/{}.sql'.format(file)])
            #p.communicate()
            dbm.write_query_table(sql_utils.get_sql_as_string(SQL_PATH + '/' + file))
            print("Done running SQL file {}".format(file))
        localendtime = dt.datetime.now()
        localduration = localendtime - localstarttime
        print(localendtime)
        print('Runtime: ' + str(localduration))
        print('\n')
        localstarttime = localendtime


def main():
    """Main function to run tasks."""
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    print(SQL_PATH)
    print('\n' + '\n' + 'Started at ' + str(starttime))
    print('\n')

    # Define list of files you want to run
    files = [
        # 'parse.00_01_01_load_sba_datasets.py',
        # 'parse/00_01_02_sba__foia_7a_1991_1999',
        # 'parse/00_01_03_sba__foia_7a_2000_2009',
        # 'parse/00_01_04_sba__foia_7a_2010_present',
        # 'parse/00_01_05_sba__foia_504_1991_present',
        # 'parse.00_02_01_load_census_datasets.py'
        # 'parse/00_02_02_census__zip_business_patterns',
        # '00_03_01_load_irs_datasets.py',
        # 'parse/00_03_02_irs__zip_data',
        # 'queries/stg_analytics/00_01_sba_sfdo',
        # 'queries/stg_analytics/00_02_zip_agi',
        'queries/stg_analytics/00_03_census_naics',
        'queries/trg_analytics/00_01_sba_metrics',
    ]

    # Run files
    run_files(dbm, files, args.db_url)

    endtime = dt.datetime.now()

    duration = endtime - starttime

    print('Ended at: ' + str(endtime))
    print('Total Runtime: ' + str(duration))
    print('Done!')
    print('\n')


if __name__ == '__main__':
    main()
