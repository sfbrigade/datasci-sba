"""
Load SBA FOIA datasets + data dictionary

Source of data:
"""
import argparse

import pandas as pd


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--dbm', help='Database Manager Object.', required=True)
    return parser.parse_args()


def load_foia_datasets(dbm, direc):
    """Load foia datasets

    Keyword Args:
        dbm: DBManager object
        dir: Directory where files are
    """
    foia_504_1991_present = pd.read_excel(direc + 'FOIA - 504 (FY1991-Present).xlsx')
    foia_7a_1991_1999 = pd.read_excel(direc + 'FOIA - 7(a) (FY1991-FY1999).xlsx')
    foia_7a_2010_present = pd.read_excel(direc + 'FOIA - 7(a) (FY2010-Present).xlsx')

    dbm.write_df_table(foia_504_1991_present)
    dbm.write_df_table(foia_7a_1991_1999)
    dbm.write_df_table(foia_7a_2010_present)


def load_foia_data_dictionary(dbm, direc):
    """Load foia data dictionary

    Keyword Args:
        dbm: DBManager object
        dir: Directory where files are
    """
    foia_7a_504_data_dict = pd.read_excel('7a_504_FOIA Data Dictionary.xlsx')
    dbm.write_df_table(foia_7a_504_data_dict)


def main():
    """Execute Stuff"""
    print('Writing FOIA datasets')
    args = get_args()
    dbm = args.dbm
    directory = '/Users/VincentLa/git/datasci-sba/src/data/'
    load_foia_datasets(dbm, directory)
    load_foia_data_dictionary(dbm, directory)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()

