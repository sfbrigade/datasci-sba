import pandas as pd
import numpy as np
import statsmodels.api as sm


def import_data(filename):
    '''
    INPUT: string of filepath to csv data filepath
    OUTPUT: pandas dataframe

    Use this function to read in the SBA data. I hardcoded the approval date to a
    datetime object, so this function will only work on the SBA dataframe.
    '''
    df = pd.read_csv(filename)
    df['ApprovalDate'] = pd.to_datetime(df['ApprovalDate'])
    df['ChargeOffDate'] = pd.to_datetime(df['ChargeOffDate'])
    df['Success'] = df['ChargeOffDate'].isnull() * 1
    return df


def feature_engineer(df):
    return df


def dummify_variables(df, var_names):
    '''
    INPUT: pandas df from import_data fxn
           list of column names to dummify
    OUTPUT: pandas df with dummified variables from list
    '''
    if 'grade' in var_names:
        grade_dummies = pd.get_dummies(
            pd.cut(df['grade'], bins=[0, 4, 7, 10, 13]))
        grade_dummies.columns = ['low_grade',
                                 'mid_grade', 'high_grade', 'higher_grade']
    

    return df.join(grade_dummies).drop(['grade', 'low_grade'], axis=1)


def train_model(data, dropped_columns=['Unnamed: 0', 'Column', 'BorrName', 'BorrStreet', 'BorrCity', 'BorrState', 'BankStreet', 'BankCity', 'BankState', 'SBADistrictOffice', 'ProjectState', 'ProjectCounty', 'ThirdPartyLender_State', 'ThirdPartyLender_Name', 'ThirdPartyLender_City', 'ChargeOffDate'], print_summary=False):
    y = data['Success']
    X = data.drop(dropped_columns, axis=1)
    X = sm.add_constant(X)
    model = sm.Logit(y, X)
    trained_model = model.fit()
    if print_summary:
        print trained_model.summary()
    else:
        return trained_model

if __name__ == '__main__':
    SBA_data = import_data('../data/FOIA_SFDO_504_7A.csv')
    train_model(SBA_data, print_summary=True)
