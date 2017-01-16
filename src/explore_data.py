import csv
import numpy as np
import pandas as pd
from StringIO import StringIO


'''
The purpose of this script is to allow users to load the different files,
in python, for further processing, feature engineering, and analysis. The
files will be loaded into dataframes where no feature engineering has been
done, but missing values are identified as nans and appropriate functions
are used to label items as ints, floats, etc. Conversion of datestrings
into pydatetimes is not done as, for 1.4 million rows, can take quite some
time. This can easily be done, however, with a simple command:

df.approvaldate = df.approvaldate.apply(pd.to_datetime)

This script can be imported into an ipython notebook, or other scripts/modules
so that users can easily get started to work on this project

Quick notes:
1. the data dictionary to understand all of the information is available
by clicking the link below:
http://imedia.sba.gov/vd/general/foia/7a_504_FOIA%20Data%20Dictionary.xlsx

2. For the 504 loan type data take note that there is a difference between
the data dictionary and the file itself, as the file has some extra columns,
namely:
 - sbadistrictoffice
 - congressionaldistrict

3. There is a discrepancy between the data dictionary for the 7a files and
the files themselves, where there are more columns in the file than there are
columns described in the data dictionary. The additional columns are the ff:
 - sbadistrictoffice
 - congressionaldistrict
'''


def load_fiveofour_data():
    '''
    Args:
        None
    Returns:
        df (dataframe): dataframe of 504 loan data information
    '''
    df = pd.read_csv('data/504-1991-2016.csv', skiprows=1)
    df.columns = [c.lower().replace(' ', '_') for c in df.columns]
    return df


def clean_7a_files(df):
    '''
    Args:
        df (dataframe): this is the basic dataframe for all the 7a loan files
    Returns:
        df (dataframe): the same dataframe above with the ff adjustments:
             - unnecessary columns and rows have been dropped
             - empty feature values are replaced with nans
             - appropriate variable types have been placed on columns:
                - grossapproval --> int
                - sbaguaranteedapproval --> int
                - approvalfiscalyear --> int
                - terminmonths --> int
                - initialinterestrate --> float
                - revolverstatus --> int
                - jobssupported --> int
                - grosschargeoffamount --> int
    '''
    #  drop unnecessary columns
    df.drop([337043, 1027391, 1398451], inplace=True)
    df = df.reset_index()
    df.drop('index', axis=1, inplace=True)
    #  fill empty values with nans
    df.replace(to_replace='', value=np.nan, inplace=True)
    #  apply appropriate variable types
    df.grossapproval = df.grossapproval.apply(int)
    df.sbaguaranteedapproval = df.sbaguaranteedapproval.apply(int)
    df.approvalfiscalyear = df.approvalfiscalyear.apply(int)
    df.terminmonths = df.terminmonths.apply(int)
    df.initialinterestrate = df.initialinterestrate.apply(float)
    df.revolverstatus = df.revolverstatus.apply(int)
    df.jobssupported = df.jobssupported.apply(int)
    df.grosschargeoffamount = df.grosschargeoffamount.apply(int)
    return df


def load_7a_data():
    '''
    Args:
        None
    Returns:
        df (dataframe): dataframe of all three 7a dataframes stacked on each
        other
    Notes:
        a) index number 337043, 1027391, 1398451 from the constructed df
        all refer to the column header, and have been hard coded and cleaned
        in this function
    '''
    file_7a_1991, file_7a_2000, file_7a_2010 = [], [], []
    with open('data/7a-1991-1999-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_1991.append(list(csv.reader(s))[0])
    with open('data/7a-2000-2009-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_2000.append(list(csv.reader(s))[0])
    with open('data/7a-2010-2016-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_2010.append(list(csv.reader(s))[0])
    file_7a_1991.extend(file_7a_2000)
    del file_7a_2000
    file_7a_1991.extend(file_7a_2010)
    del file_7a_2010
    df = pd.DataFrame(file_7a_1991)
    del file_7a_1991
    df.columns = df.ix[337043]
    df.columns = [c.lower().replace(' ', '_') for c in df.columns]
    df = clean_7a_files(df)
    return df


if __name__ == "__main__":
    fof_df = load_fiveofour_data()
    df = load_7a_data()
