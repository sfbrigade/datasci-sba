/*
This query aggregates mean agi, total number of businesses, and SBA counts at the zip code level.

Also computes relevant metrics, sba loans per small businesses.
*/

drop table if exists trg_analytics.sba_region_level;
create table trg_analytics.sba_region_level
(
  id serial primary key,
  region_type text not null,
  region text not null,
  sba_district_office text,
  mean_agi numeric,
  total_small_bus int,
  total_sba int,
  total_504 int,
  total_7a int,
  sba_per_small_bus numeric,
  loan_504_per_small_bus numeric,
  loan_7a_per_small_bus numeric,
  unique(region_type, region)
);

insert into trg_analytics.sba_region_level
(
  region_type,
  region,
  sba_district_office,
  mean_agi,
  total_small_bus,
  total_sba,
  total_504,
  total_7a,
  sba_per_small_bus,
  loan_504_per_small_bus,
  loan_7a_per_small_bus
)

select
  'zipcode'::text as region_type,
  borr_zip as region,
  sba_district_office,
  mean_agi,
  total_small_bus,
  total_sba,
  total_504,
  total_7a,
  round(1.0 * total_sba / total_small_bus, 3) as sba_per_small_bus,
  round(1.0 * total_504 / total_small_bus, 3) as loan_504_per_small_bus,
  round(1.0 * total_7a / total_small_bus, 3) as loan_7a_per_small_bus
from
(
select
  sba.borr_zip,
  sba.sba_district_office,
  irs.mean_agi,
  census.num_establishments as total_small_bus,
  count(*) as total_sba,
  sum((sba.program = '504')::int) as total_504,
  sum((sba.program = '7A')::int) as total_7a
from stg_analytics.sba_sfdo_all as sba
  inner join stg_analytics.sba_sfdo_zips as valid_zips
    on sba.borr_zip = valid_zips.zipcode
  left join stg_analytics.census_naics as census
    on sba.borr_zip = census.zipcode
      and census.naics2012 = '00'
  left join stg_analytics.irs_income as irs
    on sba.borr_zip = irs.zipcode
group by sba.borr_zip, sba.sba_district_office, irs.mean_agi, census.num_establishments
) as sub
;
