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

 3.
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
    file_7a_1991 = []
    with open('data/7a-1991-1999-mod.csv') as f:
        for line in f:
            s = StringIO(line)
            file_7a_1991.append(list(csv.reader(s))[0])
    return file_7a_1991


if __name__ == "__main__":
    # df = load_fiveofour_data()
    file_7a_1991 = load_7a_data()
