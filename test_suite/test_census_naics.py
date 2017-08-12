"""Unit Test for current_scores.sql query"""
import datetime

import pytest
import sqlalchemy as sqla

# This is the Query we are going to test.
QUERY_FILENAME = '../pipeline/pipeline_tasks/queries/stg_analytics/00_03_census_naics.sql'

TARGET_SCHEMA = 'stg_analytics'
TARGET_TABLE_NAME = 'census_naics'

METADATA = sqla.MetaData()

DATA_INGEST__CENSUS__ZIP_BUSINESS_PATTERNS = sqla.Table(
    'census__zip_business_patterns', METADATA,
    sqla.Column('zipcode', sqla.Text),
    sqla.Column('geo_id', sqla.Text),
    sqla.Column('naics2012', sqla.Text),
    sqla.Column('naics2012_ttl', sqla.Text),
    sqla.Column('estab', sqla.Text),
    sqla.Column('empszes_ttl', sqla.Text),
    schema='data_ingest')

STG_ANALYTICS__SBA_SFDO_ZIPS = sqla.Table(
    'sba_sfdo_zips', METADATA,
    sqla.Column('zipcode', sqla.Text),
    schema='stg_analytics')

SOURCE_TABLES = [
    DATA_INGEST__CENSUS__ZIP_BUSINESS_PATTERNS,
    STG_ANALYTICS__SBA_SFDO_ZIPS
]

TARGET_QUERY = 'SELECT * FROM %s.%s' % (TARGET_SCHEMA, TARGET_TABLE_NAME)


@pytest.fixture(autouse=True)
def db_setup(tpostgres):
    """Set up Database"""
    tpostgres.set_up_database(SOURCE_TABLES, TARGET_SCHEMA)


def test_nothing_in_nothing_out(tpostgres):
    """Simple no data in, no data out test"""
    # Execute
    tpostgres.run_transform_query(QUERY_FILENAME)

    # Verify
    results = tpostgres.connection.execute(TARGET_QUERY)
    assert results.rowcount == 0


# @pytest.mark.parametrize(
#     'to_insert, expected, comments',
#     [
#         (
#             [
#                 {'patient_id': 1, 'assessment_type': 'assessment1', 'risk_score': 93,
#                  'date_modified': datetime.date(2017, 1, 1)},
#                 {'patient_id': 1, 'assessment_type': 'assessment1', 'risk_score': 95,
#                  'date_modified': datetime.date(2017, 1, 2)},
#                 {'patient_id': 1, 'assessment_type': 'assessment1', 'risk_score': 90,
#                  'date_modified': datetime.date(2017, 1, 3)},
#             ],
#             [(1, 90)],
#             'Last Score was a 90 revised on 2017-01-03'
#         ),
#     ])
# def test_most_recent_score(tpostgres, to_insert, expected, comments):
#     """Tests that we are pulling most recent score for a test."""
#     tpostgres.connection.execute(
#         sqla.insert(TUTORIAL_DATA_INGEST__RISK_ASSESSMENTS, values=to_insert))

#     # Execute
#     tpostgres.run_transform_query(QUERY_FILENAME)

#     # Verify
#     results = tpostgres.connection.execute(TARGET_QUERY)
#     rows = [(row.patient_id, row.risk_score) for row in results]
#     assert rows == expected
