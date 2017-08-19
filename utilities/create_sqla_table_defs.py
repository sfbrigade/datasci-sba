"""Given table names, get the sqlalchemy table definition"""
import argparse
import sqlalchemy as sa

from utilities.db_manager import DBManager

TYPE_MAP = {
    'abstime': 'sa.DateTime',
    'bigint': 'sa.BigInteger',
    'boolean': 'sa.Boolean',
    'char': 'sa.Text',
    'character': 'sa.Text',
    'character varying': 'sa.Text',
    'date': 'sa.Date',
    'daterange': 'pg.DATERANGE',
    'double precision': 'sa.Numeric',
    'inet': 'sa.String',
    'integer': 'sa.Integer',
    'name': 'sa.String',
    'numeric': 'sa.Numeric',
    'oid': 'sa.BigInteger',
    'real': 'sa.Numeric',
    'smallint': 'sa.Integer',
    'text': 'sa.Text',
    'timestamp without time zone': 'sa.DateTime',
    'timestamp with time zone': 'sa.DateTime',
    'time without time zone': 'sa.DateTime',
    'tsrange': 'pg.TSRANGE',
    'tstzrange': 'pg.TSTZRANGE',
    'uuid': 'pg.UUID(as_uuid=True)',
    'ARRAY': 'pg.ARRAY(sa.Text, dimensions=1)'
}


def get_args():
    """Use argparse to parse command line arguments."""
    parser = argparse.ArgumentParser(description='Get sqlalchemy table definitions')
    parser.add_argument('--db_url', help='Database url string to the db.', type=str, required=True)
    parser.add_argument(
        '--output_file', help='output file where table definitions are dumped to',
        type=str, default='table_def_dump.py')
    parser.add_argument('--table_name', help='table name', required=True)
    return parser.parse_args()


def get_sqla_table(conn, table_name):
    """Return sqlalchemy table object given table name and connection string"""
    metadata = sa.MetaData(bind=conn)
    schema, table = table_name.split('.')
    return sa.Table(table, metadata, schema=schema, autoload=True)


def query_info_schema_table_def(conn, table_name):
    """Query table definition from information_schema.columns"""
    information_schema__columns = get_sqla_table(conn, 'information_schema.columns')
    schema, table = table_name.split('.')

    return sa.select([
              information_schema__columns.c.table_schema,
              information_schema__columns.c.table_name,
              information_schema__columns.c.column_name,
              information_schema__columns.c.data_type
          ]).select_from(information_schema__columns)\
            .where(sa.and_(information_schema__columns.c.table_schema == schema,
                            information_schema__columns.c.table_name == table))


def write_file(conn, table_name, output_filename):
    """Write table definition to file"""
    print('writing table definitions to file!')
    
    schema, table = table_name.split('.')
    select = query_info_schema_table_def(conn, table_name)
    table_defs = [dict(row) for row in conn.execute(select)]
    with open(output_filename, 'w') as output_file:
        table_string = ''
        table_string += "{}__{} = sa.Table(\n".format(schema.upper(), table.upper())
        table_string += "    '{}', METADATA,\n".format(table)
        for row in table_defs:
            table_string += "    sa.Column('{}', {}), \n".format(row['column_name'],
                                                                       TYPE_MAP[row['data_type']])
        table_string += "    schema='{}')\n\n".format(schema)
        output_file.write(table_string)


def main():
    """Get sqlalchemy table definition"""
    args = get_args()

    if 'postgresql' not in args.db_url:
        print("Does not look like you passed in a valid postgres url.")
    else:
        dbm = DBManager(db_url=args.db_url)
        with dbm.engine.begin() as conn:
            write_file(conn, args.table_name, args.output_file)
    print('Done writing table definitions to file', args.output_file)

if __name__ == '__main__':
    main()
