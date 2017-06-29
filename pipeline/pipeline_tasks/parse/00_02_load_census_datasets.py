"""
Load Census Datasets

Source of data:
"""
import argparse

import pandas as pd

from utilities.db_manager import DBManager


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()


def load_census_datasets(dbm, direc):
    """Load census datasets

    Keyword Args:
        dbm: DBManager object
        direc: Directory where files are
    """
    # Read tables in chunks: https://stackoverflow.com/questions/13651117/pandas-filter-lines-on-load-in-read-csv
    iter_table = pd.read_table(direc + 'CB1500CZ21.dat', sep="|", dtype=str, iterator=True, chunksize=1000)
    # Let's just write California, otherwise the file is too big
    df = pd.concat([chunk[chunk['ST'] == '06'] for chunk in iter_table])
    dbm.write_df_table(
        df, table_name='census__zip_business_patterns', schema='data_ingest')


def main():
    """Execute Stuff"""
    print('Parsing Census datasets')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    directory = '/Users/VincentLa/git/datasci-sba/src/data/census/'
    load_census_datasets(dbm, directory)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()

