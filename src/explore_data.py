import numpy as np
import pandas as pd
import csv
from StringIO import StringIO


'''
The purpose of this script is to put the different files together in order
to create an interpretable file for individuals to make visualizations
and browse through an ipython notebook. This script can be imported into
an ipython notebook, as well as its functions, so that users can get started
quickly and easily with working with this data

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
- sbadistrictoffice (my best guess)
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


def load_7a_data():
    '''
    Args:
        None
    Returns:
        df (dataframe): dataframe of all three 7a dataframes stacked on each
        other
    '''
    columns = ['program', 'borrname', 'borrstreet', 'borrcity', 'borrstate',
               'borrzip', 'bankname', 'bankstreet', 'bankcity', 'bankstate',
               'bankzip', 'grossapproval', 'sbaguaranteedapproval',
               'approvaldate', 'approvalfiscalyear', 'firstdisbursementdate',
               'deliverymethod', 'subpgmdesc', 'initialinterestrate',
               'terminmonths', 'naicscode', 'naicsdescription',
               'franchisecode', 'franchisename', 'projectcounty',
               'projectstate', 'sbadistrictoffice', 'unknownnumber',
               'businesstype', 'loanstatus', 'chargeoffdate',
               'grosschargeoffamount', 'revolverstatus', 'jobssupported']
    file_7a_1991 = []
    file_7a_2000 = []
    file_7a_2010 = []
    print('loading 7a-1991-1999-mod.csv')
    with open('data/7a-1991-1999-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_1991.append(list(csv.reader(s))[0])
    print('loading 7a-2000-2009-mod.csv')
    with open('data/7a-2000-2009-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_2000.append(list(csv.reader(s))[0])
    print('loading 7a-2010-2016-mod.csv')
    with open('data/7a-2010-2016-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_2010.append(list(csv.reader(s))[0])
    file_7a_1991.extend(file_7a_2000)
    del file_7a_2000
    file_7a_1991.extend(file_7a_2010)
    del file_7a_2010
    df = pd.DataFrame(file_7a_1991, columns=columns)
    return df


if __name__ == "__main__":
    # df = load_fiveofour_data()
    df = load_7a_data()
