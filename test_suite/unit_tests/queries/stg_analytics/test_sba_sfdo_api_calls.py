"""Unit Test for sba_sfdo_api_calls.py"""
import datetime

import pytest
import sqlalchemy as sa

from pipeline.pipeline_tasks.queries.stg_analytics import sba_sfdo_api_calls as api_calls
import test_suite.tables as tbls
from utilities.db_manager import DBManager


METADATA = sa.MetaData()
TARGET_SCHEMA = 'stg_analytics'

SOURCE_TABLES = [tbls.STG_ANALYTICS__SBA_SFDO]


@pytest.fixture(autouse=True)
def db_setup(tpostgres):
    """Set up Database"""
    tpostgres.set_up_database(SOURCE_TABLES, TARGET_SCHEMA)


@pytest.mark.parametrize(
    'to_insert, comments',
    [
        (
            [
                {
                    'sba_sfdo_id': 1,
                    'borr_name': 'Mike',
                    'borr_street': '22 4th street',
                    'borr_city': 'San Francisco',
                    'borr_state': 'CA',
                    'borr_zip': '94103',
                },
            ],
            'Testing basic insert'
        ),
    ])
def test_get_congressional_districts(tpostgres, to_insert, comments):
    """Tests that we are getting congressional districts correctly"""
    conn = tpostgres.session.connection()
    conn = tpostgres.postgresql_url
    tpostgres.connection.execute(
        sa.insert(tbls.STG_ANALYTICS__SBA_SFDO, values=to_insert))

    # dbm = DBManager(db_url=conn)

    # congressional_districts = api_calls.get_congressional_districts(dbm)
    assert False
