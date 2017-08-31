"""Utility functions for working with sqlalchemy."""

import sqlalchemy as sa


def get_sqla_table(conn, table_name):
    """Return sqlalchemy table object given table name and connection string"""
    metadata = sa.MetaData(bind=conn)
    schema, table = table_name.split('.')
    return sa.Table(table, metadata, schema=schema, autoload=True)
