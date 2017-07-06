/*

This query:
1. Counts the total number of SBA businesses by zip code from the sba_sfdo table.
2. Performs a left join of (1) against a count of 504 loans by zip code.
3. Performs a left join of (1) against a count of 7A loans by zip code.
4. Performs a left join of (1) against NAICS data by zip code (to obtain # of small businesses).
	- here we reduce the NAICS data to only look at Total Number of Businesses
5. Performs a left join of (1) against IRS data by zip code (to obtain mean AGI by zip code).
6. Calculates ratios of total SBA loans, 504 loans, & 7A loans to the total number of businesses.
7. Writes output to new table.

*/

drop table if exists trg_analytics.sba_zip_level;
create table trg_analytics.sba_zip_level

(
	borr_zip bigint
	,total_sba int
	,total_504 int
	,total_7a int
	,total_small_bus varchar
	,mean_agi varchar
	,sba_per_small_bus float
	,loan_504_per_small_bus float
	,loan_7a_per_small_bus float
);

insert into trg_analytics.sba_zip_level

select
	a_combined.borr_zip
	,a_combined.total_sba
	,a_504.total_504
	,a_7a.total_7a
	,a_naics.num_establishments as total_small_bus
	,a_irs.mean_agi as mean_agi
	,case when a_naics.num_establishments = 0 then null
          else a_combined.total_sba / a_naics.num_establishments
     end as sba_per_small_bus
	,case when a_naics.num_establishments = 0 then null
	      else a_504.total_504 / a_naics.num_establishments
	 end as loan_504_per_small_bus
	,case when a_naics.num_establishments = 0 then null
	      else a_7a.total_7a / a_naics.num_establishments
	 end as loan_7a_per_small_bus

from

	(
	select
		borr_zip
		,count(*) as total_sba

	from stg_analytics.sba_sfdo

	group by borr_zip

	) a_combined

	left join

	(
	select
		borr_zip
		,count(*) as total_504

	from stg_analytics.sba_sfdo

	where Program = '504'

	group by borr_zip

	) a_504

	on a_combined.borr_zip = a_504.borr_zip

	left join

	(
	select
		borr_zip
		,count(*) as total_7a

	from stg_analytics.sba_sfdo

	where Program = '7A'

	group by borr_zip

	) a_7a

	on a_combined.borr_zip = a_7a.borr_zip

	left join

	(
	select
		num_establishments
		,geo_id
		,cast(zipcode as bigint)

	from stg_analytics.census_naics

	where naics2012 = '00'

	) a_naics

	on a_combined.borr_zip = a_naics.zipcode

	left join

	(
	select
		cast(zipcode as bigint)
		,mean_agi

	from stg_analytics.irs_income

	) a_irs

	on a_combined.borr_zip = a_irs.zipcode
;
