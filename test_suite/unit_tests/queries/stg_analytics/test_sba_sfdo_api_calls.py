"""Unit Test for sba_sfdo_api_calls.py"""
import datetime

import pytest
import sqlalchemy as sa

from pipeline.pipeline_tasks.queries.stg_analytics import sba_sfdo_api_calls as api_calls
import test_suite.tables as tbls
from utilities.db_manager import DBManager
from utilities.sqla_utils import get_sqla_table


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
    conn = tpostgres.session.connection()  # This returns a sqlalchemy.engine.base.Connection object
    db_url = tpostgres.postgresql_url  # This returns a local db url string: postgresql://postgres@127.0.0.1:51297/test
    tpostgres.connection.execute(
        sa.insert(tbls.STG_ANALYTICS__SBA_SFDO, values=to_insert))

    sba_sfdo = get_sqla_table(conn, 'stg_analytics.sba_sfdo')
    select = sa.select([sba_sfdo.c.sba_sfdo_id])\
               .select_from(sba_sfdo)
    results = [dict(row) for row in conn.execute(select)]

    dbm = DBManager(db_url)
    print(dbm.db_url)
    print('hello')
    print(conn)
    print(results)

    dbm.load_table(table_name='sba_sfdo', schema='stg_analytics')
    # congressional_districts = api_calls.get_congressional_districts(dbm)
    assert False
