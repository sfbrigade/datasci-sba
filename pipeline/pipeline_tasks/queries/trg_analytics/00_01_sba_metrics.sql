/*
This query aggregates mean agi, total number of businesses, and SBA counts at the zip code level.

Also computes relevant metrics, sba loans per small businesses.
*/

drop table if exists trg_analytics.sba_zip_level;
create table trg_analytics.sba_zip_level
(
  id serial primary key,
  borr_zip text,
  mean_agi numeric,
  total_small_bus int,
  total_sba int,
  total_504 int,
  total_7a int,
  sba_per_small_bus numeric,
  loan_504_per_small_bus numeric,
  loan_7a_per_small_bus numeric
);

create index sba_zip_level_borr_zip on trg_analytics.sba_zip_level using btree(borr_zip);

insert into trg_analytics.sba_zip_level
(
  borr_zip,
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
  borr_zip,
  mean_agi,
  total_small_bus,
  total_sba,
  total_504,
  total_7a,
  1.0 * total_sba / total_small_bus as sba_per_small_bus,
  1.0 * total_504 / total_small_bus as loan_504_per_small_bus,
  1.0 * total_7a / total_small_bus as loan_7a_per_small_bus
from
(
select
  sba.borr_zip,
  irs.mean_agi,
  census.num_establishments as total_small_bus,
  count(*) as total_sba,
  sum((sba.program = '504')::int) as total_504,
  sum((sba.program = '7A')::int) as total_7a
from stg_analytics.sba_sfdo as sba
  inner join stg_analytics.sba_sfdo_zips as valid_zips
    on sba.borr_zip = valid_zips.zipcode
  left join stg_analytics.census_naics as census
    on sba.borr_zip = census.zipcode
      and census.naics2012 = '00'
  left join stg_analytics.irs_income as irs
    on sba.borr_zip = irs.zipcode
group by sba.borr_zip, irs.mean_agi, census.num_establishments
) as sub
;

