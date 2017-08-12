""" configure the test suite to share a database """

import datetime
import functools
import glob
import os
import re

import pytest
import sqlalchemy as sa
import sqlalchemy.event as sa_event
import sqlalchemy.exc as sa_exc
import sqlalchemy.orm as sa_orm
import testing.postgresql


REPO_BASE_DIR = os.path.dirname(__file__)


@pytest.fixture(scope='session')
def database(request):
    """Session-wide test database."""
    url = os.getenv('POSTGRES_TESTSERVER')

    if not url:
        db = testing.postgresql.Postgresql()
        url = db.url()
        request.addfinalizer(db.stop)

    engine = sa.create_engine(url)
    engine.execute(sa.text('create extension if not exists "uuid-ossp"'))
    engine.execute(sa.text('create extension if not exists btree_gist'))
    engine.dispose()

    return url


@pytest.fixture(scope='class')
def shared_postgresql(database: str, request):
    request.cls.postgresql_url = database

    engine = sa.create_engine(database)
    request.cls.engine = engine
    request.addfinalizer(engine.dispose)


def with_connection(test_function):
    """Decorator to wrap functions in PostgresTestCase to facilitate optional connection."""

    @functools.wraps(test_function)
    def wrapper(self, *args, conn=None, **kwargs):
        """The wrapped function that provides connection, or not, as needed."""
        if conn is not None:
            return test_function(self, *args, conn=conn, **kwargs)
        elif self.connection is not None:
            return test_function(self, *args, conn=self.connection, **kwargs)
        else:
            with self.engine.begin() as wrapper_conn:
                return test_function(self, *args, conn=wrapper_conn, **kwargs)
    return wrapper


class PostgresTestUtil:
    """
    Utility to wrap testing.postgresql and provide extra functionality.
    Arguments:
        request (pytest.FixtureRequest): pytest request object.
            Used to figure out the file-system locations of tests
            for path operations.
        engine (sa.engine.Engine): Engine connected to test DB.
        url (str): URI of postgres database.
        connection (Optional[sa.engine.Connection]): Open connection to DB.
        transaction (Optional[sa.engine.Transaction]): A DB transaction
            created via connection.begin().
        sessionmaker (Optional[sa.orm.session.sessionmaker]):
        session (Optional[sa.orm.session.Session]): Open Sqlalchemy session.
    """
    INITIAL_SCHEMAS = {
        'information_schema',
        'pg_catalog',
        'pg_temp_1',
        'pg_toast',
        'pg_toast_temp_1',
        'public',
    }

    EXTENSIONS = {
        'uuid-ossp',
        'btree_gist',
    }

    def __init__(
            self, request, engine, url, connection=None, transaction=None,
            sessionmaker=None, session=None):
        self.request = request  # pytest request object
        self.engine = engine  # type: sa.engine.base.Engine
        self.postgresql_url = url  # type: str
        self.connection = connection
        self.transaction = transaction
        self.sessionmaker = sessionmaker
        self.session = session

    def reset_db(self):
        """Reset the database by dropping all non-initial schemas."""
        try:
            with self.engine.begin() as connection:
                rows = connection.execute('SELECT schema_name FROM information_schema.schemata')
                schemas = {row['schema_name'] for row in rows} - self.INITIAL_SCHEMAS
                query = ';'.join('DROP SCHEMA %s CASCADE' % s for s in schemas)
                connection.execute(query)
        except sa_exc.OperationalError:
            # Handle psycopg2 OOM errors caused by large transactions
            # by removing tables in non-initial schemas one-by-one,
            # then removing their empty schemas.
            with self.engine.connect() as connection:
                rows = connection.execute('SELECT schema_name FROM information_schema.schemata')
                schemas = {row['schema_name'] for row in rows} - self.INITIAL_SCHEMAS
                for schema in schemas:
                    info_query = ("""SELECT table_name FROM information_schema.tables
                                  WHERE table_schema = '%s'
                                  AND table_type = 'BASE TABLE';""" % schema)
                    rows = connection.execute(info_query)
                    tables = [row['table_name'] for row in rows]
                    for table in tables:
                        query = 'DROP TABLE IF EXISTS %s.%s CASCADE;' % (schema, table)
                        connection.execute(query)
                    query = 'DROP SCHEMA %s CASCADE;' % schema
                    connection.execute(query)

        with self.engine.begin() as connection:
            connection.execute(sa.text('CREATE SCHEMA IF NOT EXISTS public'))
            query = ';'.join('CREATE EXTENSION IF NOT EXISTS "%s"' % e for e in self.EXTENSIONS)
            connection.execute(query)

    @with_connection
    def _has_schema(self, schema, *, conn=None):
        return self.engine.dialect.has_schema(conn, schema)

    @with_connection
    def _has_table(self, table, schema=None, *, conn=None):
        return self.engine.dialect.has_table(conn, table, schema=schema)

    @with_connection
    def create_schemas(self, schemas, *, conn=None):  # pylint: disable=no-self-use
        """Add a list of schemas to the test database."""
        for schema in schemas:
            conn.execute('CREATE SCHEMA IF NOT EXISTS %s' % schema)

    @with_connection
    def create_tables(self, tables, *, conn=None):
        """Create a list of tables in the test database using predefined schemas."""
        for table in tables:
            conn.execute('CREATE SCHEMA IF NOT EXISTS %s' % table.schema)
            table.create(conn)

    def assertHasSchema(self, schema, *, msg=None, conn=None):
        """Assert that the database has a particular schema."""
        if msg is None:
            msg = 'Schema %s does not exist' % schema
        assert self._has_schema(schema, conn=conn), msg

    def assertNotHasSchema(self, schema, *, msg=None, conn=None):
        """Assert that the database does not have a particular schema."""
        if msg is None:
            msg = 'Schema %s exists' % schema
        assert not self._has_schema(schema, conn=conn), msg

    def assertHasTable(self, table, *, msg=None, schema=None, conn=None):
        """Assert that the database has a particular table."""
        if msg is None:
            if schema is None:
                msg = 'Table %s does not exist' % table
            else:
                msg = 'Table %s does not exist in schema %s' % (table, schema)
        assert self._has_table(table, schema=schema, conn=conn), msg

    def assertNotHasTable(self, table, *, msg=None, schema=None, conn=None):
        """Assert that the database does not have a particular table."""
        if msg is None:
            if schema is None:
                msg = 'Table %s exists' % table
            else:
                msg = 'Table %s exists in schema %s' % (table, schema)
        assert not self._has_table(table, schema=schema, conn=conn), msg

    @with_connection
    def set_up_database(self, source_tables, target_schema, *, conn=None):
        conn.execute('CREATE EXTENSION IF NOT EXISTS btree_gist')
        conn.execute('CREATE SCHEMA IF NOT EXISTS %s' % target_schema)

        for table in source_tables:
            conn.execute('CREATE SCHEMA IF NOT EXISTS %s' % table.schema)
            table.create(conn)

    @with_connection
    def load_prebuilt_schema(self, schema_name, *, conn=None):
        schema_path = os.path.join(REPO_BASE_DIR, 'testing_schemas')
        pattern = '*_' + schema_name + '.sql'
        sqlfile_glob = glob.glob(os.path.join(schema_path, pattern))

        sorted_filenames = sorted(sqlfile_glob,
                                  key=lambda n: int(os.path.basename(n).split('_', 1)[0]))

        for sqlfile_name in sorted_filenames:
            with open(sqlfile_name, 'r') as sqlfile:
                with conn.begin():
                    conn.execute(sa.DDL(sqlfile.read()))

    @with_connection
    def run_transform_query(self, query_filename, *, conn=None):
        # This is a weird hack to stay consistent with the way we use unittest.
        # postgres_testcase.py lives inside the python/test_suite directory, and all
        # query filenames are given relative to that location. Thus, we reuse that location here.
        query_fq_filename = os.path.join(
            os.path.dirname(__file__), 'test_suite', query_filename)
        with open(query_fq_filename, 'r') as query_file:
            conn.execute(sa.text(query_file.read()))


    def insert(self, table, values):
        self.connection.execute(sa.insert(table, values=values))


@pytest.fixture
def postgres(database: str, request):
    """
    Creates a PostgresTestUtil instance and triggers cleanup of the DB
    when the test is done.
    Use the tpostgres fixture unless for some reason your test cannot
    be run in a single transaction. (The tpostgres fixture leads
    to faster tests.)
    """
    engine = sa.create_engine(database)
    request.addfinalizer(engine.dispose)

    pgutil = PostgresTestUtil(request, engine, database)
    request.addfinalizer(pgutil.reset_db)

    return pgutil


@pytest.fixture
def tpostgres(database: str, request):
    """
    Creates a PostgresTestUtil instance and starts a transaction
    that will be rolled back when tests are done.
    """
    engine = sa.create_engine(database)
    request.addfinalizer(engine.dispose)

    conn = engine.connect()
    request.addfinalizer(conn.close)

    transaction = conn.begin()
    request.addfinalizer(transaction.rollback)

    sessionmaker = sa_orm.sessionmaker(conn)
    request.addfinalizer(sessionmaker.close_all)

    session = sessionmaker()
    request.addfinalizer(session.close)

    pgutil = PostgresTestUtil(
        request, engine, database, conn, transaction, sessionmaker, session)

    return pgutil
