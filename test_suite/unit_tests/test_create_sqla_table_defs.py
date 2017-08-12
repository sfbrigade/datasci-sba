"""Unit Test for create_sqla_table_defs.py utilities file"""
import datetime

import pytest
import sqlalchemy as sa

import test_suite.tables as tbls
import utilities.create_sqla_table_defs as cstd


METADATA = sa.MetaData()
TARGET_SCHEMA = 'test_schema'


TEST_SCHEMA__TEST_TABLE = sa.Table(
    'test_table', METADATA,
    sa.Column('col1', sa.Text),
    sa.Column('col2', sa.Text),
    sa.Column('col3', sa.Text),
    schema='test_schema')



SOURCE_TABLES = [TEST_SCHEMA__TEST_TABLE]


@pytest.fixture(autouse=True)
def db_setup(tpostgres):
    """Set up Database"""
    tpostgres.set_up_database(SOURCE_TABLES, TARGET_SCHEMA)


def test_query_info_schema_table_def(tpostgres):
    """Tests that we are pulling most recent score for a test."""
    conn = tpostgres.session.connection()
    select = cstd.query_info_schema_table_def(conn, 'test_schema.test_table')
    results = [dict(row) for row in conn.execute(select)]
    expected = [
        {
            'table_schema': 'test_schema',
            'table_name': 'test_table',
            'column_name': 'col1',
            'data_type': 'text'
        },
        {
            'table_schema': 'test_schema',
            'table_name': 'test_table',
            'column_name': 'col2',
            'data_type': 'text'
        },
        {
            'table_schema': 'test_schema',
            'table_name': 'test_table',
            'column_name': 'col3',
            'data_type':
            'text'
        }
    ]
    assert results == expected
