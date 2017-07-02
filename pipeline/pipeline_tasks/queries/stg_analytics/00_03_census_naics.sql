/*

This query:
1. Takes the census__zip_business_patterns table and limits rows to:
	- businesses that qualify as small (<500 employees)
	- zip codes that are part of SFDO
2. Calculates the sum of small businesses (column "ESTAB")
3. Writes output to new table.

Note: the output IS NOT at the zip code level, but rather at the zip-code-by-NAICS-code level. We reduce it further in the next part of the pipeline.

*/




drop table if exists stg_analytics.census_naics;
create table stg_analytics.census_naics

(
	"ZIPCODE" varchar
	,"GEO_ID" varchar
	,"NAICS2012" varchar
	,"NAICS2012_TTL" varchar
	,"ESTAB" varchar
);

insert into stg_analytics.census_naics

select
	"ZIPCODE"
	,"GEO_ID"
	,"NAICS2012"
	,"NAICS2012_TTL"
	,sum(cast("ESTAB" as int))

from data_ingest.census__zip_business_patterns

where 
	"EMPSZES_TTL" in ('Establishments with 1 to 4 employees',
	             'Establishments with 5 to 9 employees',
	             'Establishments with 10 to 19 employees',
	             'Establishments with 20 to 49 employees',
	             'Establishments with 50 to 99 employees',
	             'Establishments with 100 to 249 employees',
	             'Establishments with 250 to 499 employees')

	and 
	cast("ZIPCODE" as varchar) in (select distinct cast("BorrZip" as varchar) from stg_analytics.sba_sfdo)

group by 
	"ZIPCODE"
	,"GEO_ID"
	,"NAICS2012"
	,"NAICS2012_TTL"
;