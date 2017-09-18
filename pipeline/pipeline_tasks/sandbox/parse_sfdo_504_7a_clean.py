"""
Parsing SFDO 504 7a loan 'clean' dataset

For the most part, we should be using data that we can reproduce from national FOIA datasets.
That being said, just for the September 2017 MVP, we are going to use a "cleaned" version of the
dataset that is already geocoded (somewhat manually) by Noah.

Source of data:
https://sfbrigade.slack.com/files/U317MMLE6/F403ZETLH/sfdo_504_7a-clean.csv
"""

import argparse
import os

import pandas as pd

from utilities.db_manager import DBManager
from utilities import util_functions as uf


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()


def load_data(dbm, direc):
    """Load census datasets
    Keyword Args:
        dbm: DBManager object
        direc: Directory where files are
    """
    df = pd.read_csv(os.path.join(direc, 'sba_google_places_loan_data.csv'))
    dbm.write_df_table(
        df, table_name='sba__google_places_loan_data', schema='sandbox')


def main():
    """Execute Stuff"""
    print('Parsing SBA SFDO Clean dataset')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    git_root_dir = uf.get_git_root(os.path.dirname(__file__))
    directory = os.path.join(git_root_dir, 'src', 'data', 'sba')
    load_data(dbm, directory)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()
