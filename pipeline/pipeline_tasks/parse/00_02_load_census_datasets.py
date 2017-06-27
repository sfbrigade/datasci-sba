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


def load_foia_datasets(dbm, direc):
    """Load foia datasets

    Keyword Args:
        dbm: DBManager object
        dir: Directory where files are
    """
    df = pd.read_table(direc + 'CB1500CZ21.dat', sep="|")
    dbm.write_df_table(
        df, table_name='census__cb1500cz21', schema='data_ingest')

def main():
    """Execute Stuff"""
    print('Parsing Census datasets')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    directory = '/Users/VincentLa/git/datasci-sba/src/data/'
    load_foia_datasets(dbm, directory)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()

