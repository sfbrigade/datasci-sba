/*

This query:
1. Takes the IRS zip code data and creates a new calculated column that is equal to:
	- adjusted gross income divided by [the total number of returns plus the number of joint returns (in order to obtain the mean AGI per taxable person)]
2. Writes the output to a new table.

Note: the new table doesn't limit the zip codes to SFDO only, though is taken care of in the later part of the pipeline.

*/


drop table if exists stg_analytics.irs_income;
create table stg_analytics.irs_income
(
  zipcode text,
  mean_agi numeric
);

insert into stg_analytics.irs_income

select
  zipcode,
  ceiling((sum(a00100) / sum(n1 + mars2)) * 1000) as mean_agi
from data_ingest.irs__zip_data
group by zipcode
;
