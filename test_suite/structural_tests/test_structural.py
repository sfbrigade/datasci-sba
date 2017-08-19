"""
Structural Test

Run SQL files in order and simply test for valid SQL.

In order for this to work files must be named in alphabetical order in the manner that they are expected to run. 
"""
import datetime
import os

import pytest
import sqlalchemy as sqla

import test_suite.tables as tbls

STG_ANALYTICS_DIR = os.path.join(os.path.dirname(__file__), '../../pipeline/pipeline_tasks/queries/stg_analytics')
TRG_ANALYTICS_DIR = os.path.join(os.path.dirname(__file__), '../../pipeline/pipeline_tasks/queries/trg_analytics')
DOCUMENTATION_DIR = os.path.join(os.path.dirname(__file__), '../../pipeline/pipeline_tasks/queries/documentation')

TARGET_SCHEMA = 'data_ingest'

# Seed the database with data_ingest tables
SOURCE_TABLES = [
    tbls.DATA_INGEST__CENSUS__ZIP_BUSINESS_PATTERNS,
    tbls.DATA_INGEST__IRS__ZIP_DATA,
    tbls.DATA_INGEST__SBA__FOIA_504_1991_PRESENT,
    tbls.DATA_INGEST__SBA__FOIA_7A_1991_1999,
    tbls.DATA_INGEST__SBA__FOIA_7A_2000_2009,
    tbls.DATA_INGEST__SBA__FOIA_7A_2010_PRESENT,
]


@pytest.fixture(autouse=True)
def db_setup(tpostgres):
    """Set up Database. In particular, seed the database with data_ingest tables"""
    tpostgres.set_up_database(SOURCE_TABLES, TARGET_SCHEMA)
    tpostgres.create_schemas(schemas=['stg_analytics', 'trg_analytics'])


def test_run_queries(tpostgres):
    """Testing running pipeline queries in alphabetical order"""
    try:
        queries = sorted(os.listdir(STG_ANALYTICS_DIR))
        for q in queries:
            tpostgres.run_transform_query(os.path.join(STG_ANALYTICS_DIR, q))

        queries = sorted(os.listdir(TRG_ANALYTICS_DIR))
        for q in queries:
            tpostgres.run_transform_query(os.path.join(TRG_ANALYTICS_DIR, q))

        queries = sorted(os.listdir(DOCUMENTATION_DIR))
        for q in queries:
            tpostgres.run_transform_query(os.path.join(DOCUMENTATION_DIR, q))
    except:
        assert False


def test_valid_folders_schemas():
    """Right now this structural test is a bit hacky and assumes that all relevant folders and schemas are located in

    the /pipeline/pipeline_tasks/queries folder. Check that the folders in there are what we expect.
    """
    queries_dir = os.path.join(os.path.dirname(__file__), '../../pipeline/pipeline_tasks/queries')
    assert sorted(os.listdir(queries_dir)) == ['documentation', 'stg_analytics', 'trg_analytics']
