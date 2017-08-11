"""
Load SBA FOIA datasets

Source of data:
"""
import argparse

import pandas as pd
import sqlalchemy as sa

from utilities.db_manager import DBManager


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Runner for tasks')
    parser.add_argument('--db_url', help='Database url string to the db.', required=True)
    return parser.parse_args()


def load_sba_datasets(dbm, direc):
    """Load foia sba datasets

    Keyword Args:
        dbm: DBManager object
        dir: Directory where files are
    """
    print('Reading FOIA 504')
    foia_504_1991_present = pd.read_excel(
        direc + 'FOIA - 504 (FY1991-Present).xlsx')

    print('Reading FOIA 7a 1991-1999')
    foia_7a_1991_1999 = pd.read_excel(
        direc + 'FOIA - 7(a) (FY1991-FY1999).xlsx',
        skiprows=1)

    print('Reading FOIA 7a 2000-2009')
    foia_7a_2000_2009 = pd.read_excel(
        direc + 'FOIA - 7(a)(FY2000-FY2009).xlsx',
        skiprows=1)

    print('Reading FOIA 7a 2010-Present')
    foia_7a_2010_present = pd.read_excel(
        direc + 'FOIA - 7(a) (FY2010-Present).xlsx')

    print('Writing FOIA 504')
    dbm.write_df_table(
        foia_504_1991_present,
        table_name='sba__foia_504_1991_present',
        schema='data_ingest',
        dtype={'Program': sa.String,
               'BorrZip': sa.String,
               'CDC_Zip': sa.String,
               'ThirdPartyLender_Name': sa.String,
               'ThirdPartyLender_City': sa.String,
               'ThirdPartyLender_State': sa.String,
               'DeliveryMethod': sa.String,
               'FranchiseCode': sa.String,
               'FranchiseName': sa.String,
               'ChargeOffDate': sa.Date,})

    print('Writing FOIA 7a 1991-1999')
    dbm.write_df_table(
        foia_7a_1991_1999,
        table_name='sba__foia_7a_1991_1999',
        schema='data_ingest',
        dtype={'Program': sa.String,
               'BorrZip': sa.String,
               'Bank_Zip': sa.String,
               'ThirdPartyLender_Name': sa.String,
               'ThirdPartyLender_City': sa.String,
               'ThirdPartyLender_State': sa.String,
               'DeliveryMethod': sa.String,
               'FranchiseCode': sa.String,
               'FranchiseName': sa.String,
               'ChargeOffDate': sa.Date,})

    print('Writing FOIA 7a 2000-2009')
    dbm.write_df_table(
        foia_7a_2000_2009,
        table_name='sba__foia_7a_2000_2009',
        schema='data_ingest',
        dtype={'Program': sa.String,
               'BorrZip': sa.String,
               'Bank_Zip': sa.String,
               'ThirdPartyLender_Name': sa.String,
               'ThirdPartyLender_City': sa.String,
               'ThirdPartyLender_State': sa.String,
               'DeliveryMethod': sa.String,
               'FranchiseCode': sa.String,
               'FranchiseName': sa.String,
               'ChargeOffDate': sa.Date,})

    print('Writing FOIA 7a 2010-present')
    dbm.write_df_table(
        foia_7a_2010_present,
        table_name='sba__foia_7a_2010_present',
        schema='data_ingest',
        dtype={'Program': sa.String,
               'BorrZip': sa.String,
               'Bank_Zip': sa.String,
               'ThirdPartyLender_Name': sa.String,
               'ThirdPartyLender_City': sa.String,
               'ThirdPartyLender_State': sa.String,
               'DeliveryMethod': sa.String,
               'FranchiseCode': sa.String,
               'FranchiseName': sa.String,
               'ChargeOffDate': sa.Date,})


def main():
    """Execute Stuff"""
    print('Parsing FOIA datasets')
    args = get_args()
    dbm = DBManager(db_url=args.db_url)
    directory = '/Users/VincentLa/git/datasci-sba/src/data/sba/'
    load_sba_datasets(dbm, directory)


if __name__ == '__main__':
    """See https://stackoverflow.com/questions/419163/what-does-if-name-main-do"""
    main()

