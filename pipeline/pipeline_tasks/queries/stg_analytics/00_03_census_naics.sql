/*

This query:
1. Takes the census__zip_business_patterns table and limits rows to:
	- businesses that qualify as small (<500 employees)
	- zip codes that are part of SFDO
2. Calculates the sum of small businesses (column ESTAB)
3. Writes output to new table.

Note: the output IS NOT at the zip code level, but rather at the zip-code-by-NAICS-code level. We reduce it further in the next part of the pipeline.

*/




drop table if exists stg_analytics.census_naics;
create table stg_analytics.census_naics
(
zipcode text,
geo_id text,
naics2012 text,
naics2012_ttl text,
num_establishments numeric
);

insert into stg_analytics.census_naics

select
  zipcode,
  geo_id,
  naics2012,
  naics2012_ttl,
  sum(cast(estab as int)) as num_establishments

from data_ingest.census__zip_business_patterns
where empszes_ttl in ('Establishments with 1 to 4 employees', 'Establishments with 5 to 9 employees',
                      'Establishments with 10 to 19 employees', 'Establishments with 20 to 49 employees',
                      'Establishments with 100 to 249 employees', 'Establishments with 250 to 499 employees')

  and zipcode::text in (select distinct borr_zip::text from stg_analytics.sba_sfdo)

group by zipcode, geo_id, naics2012, naics2012_ttl
;
