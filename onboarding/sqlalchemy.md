# Querying in SQL Alchemy

Example

```
sba_sfdo = get_sqla_table(conn, 'stg_analytics.sba_sfdo')
select = sa.select([sba_sfdo.c.sba_sfdo_id])\
           .select_from(sba_sfdo)
results = [dict(row) for row in conn.execute(select)]
```
