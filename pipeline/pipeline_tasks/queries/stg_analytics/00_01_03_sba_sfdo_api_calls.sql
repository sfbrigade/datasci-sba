/*

This query:
1. Drops the third party API table
2. Reinitializes it with the generated sba_sfdo_id key after the sba_sfdo table is rebuilt.

*/

drop table if exists stg_analytics.sba_sfdo_api_calls;
create table stg_analytics.sba_sfdo_api_calls
(
sba_sfdo_id bigint,
full_address text,
yelp_rating double precision,
yelp_total_reviews bigint,
yelp_url text,
yelp_timestamp timestamp without time zone,
civics_district text,
civics_timestamp timestamp without time zone,
geocode_data text,
geocode_timestamp timestamp without time zone
);

insert into stg_analytics.sba_sfdo_api_calls
select
  sba_sfdo_id,
  NULL as full_addr, 
  0 as yelp_rating,
  0 as yelp_total_reviews,
  NULL as yelp_url,
  NULL as yelp_timestamp,
  NULL as civics_district,
  NULL as civics_timestamp,
  NULL as geocode_data,
  NULL as geocode_timestamp
from stg_analytics.sba_sfdo;

-- Creating Indices
create index on stg_analytics.sba_sfdo_api_calls (sba_sfdo_id);
