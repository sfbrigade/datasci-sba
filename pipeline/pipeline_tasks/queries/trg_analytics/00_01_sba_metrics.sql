/*

This query:
1. Counts the total number of SBA businesses by zip code from the sba_sfdo table.
2. Performs a left join of (1) against a count of 504 loans by zip code.
3. Performs a left join of (1) against a count of 7A loans by zip code.
4. Performs a left join of (1) against NAICS data by zip code (to obtain # of small businesses).
	- here we reduce the NAICS data to only look at "Total Number of Businesses"
5. Performs a left join of (1) against IRS data by zip code (to obtain mean AGI by zip code).
6. Calculates ratios of total SBA loans, 504 loans, & 7A loans to the total number of businesses.
7. Writes output to new table.

*/

drop table if exists trg_analytics.sba_zip_level;
create table trg_analytics.sba_zip_level

(
	"BorrZip" bigint
	,"Total_SBA" int
	,"Total_504" int
	,"Total_7A" int
	,"Total_Small_Bus" varchar
	,"Mean_Agi" varchar
	,"SBA_per_Small_Bus" float
	,"504_per_Small_Bus" float
	,"7A_per_Small_Bus" float
);

insert into trg_analytics.sba_zip_level

select
	A_combined."BorrZip"
	,A_combined."Total_SBA"
	,A_504."Total_504"
	,A_7A."Total_7A"
	,A_naics."ESTAB" as "Total_Small_Bus"
	,A_irs."MEAN_AGI" as "Mean_Agi"
	,cast(A_combined."Total_SBA" as float)/cast(A_naics."ESTAB" as float) as "SBA_per_Small_Bus"
	,cast(A_504."Total_504" as float)/cast(A_naics."ESTAB" as float) as "504_per_Small_Bus"
	,cast(A_7A."Total_7A" as float)/cast(A_naics."ESTAB" as float) as "7A_per_Small_Bus"

from 

	(
	select
		"BorrZip"
		,count(*) as "Total_SBA"

	from stg_analytics.sba_sfdo

	group by "BorrZip"

	) A_combined

	left join

	(
	select
		"BorrZip"
		,count(*) as "Total_504"

	from stg_analytics.sba_sfdo

	where "Program" = '504'

	group by "BorrZip"

	) A_504

	on A_combined."BorrZip" = A_504."BorrZip"

	left join

	(
	select
		"BorrZip"
		,count(*) as "Total_7A"

	from stg_analytics.sba_sfdo

	where "Program" = '7A'

	group by "BorrZip"

	) A_7A

	on A_combined."BorrZip" = A_7A."BorrZip"

	left join

	(
	select
		"ESTAB"
		,"GEO_ID"
		,cast("ZIPCODE" as bigint)

	from stg_analytics.census_naics

	where "NAICS2012" = '00'

	) A_naics

	on A_combined."BorrZip" = A_naics."ZIPCODE"

	left join

	(
	select
		cast("ZIPCODE" as bigint)
		,"MEAN_AGI"

	from stg_analytics.irs_income

	) A_irs

	on A_combined."BorrZip" = A_irs."ZIPCODE"
;