/*
Go from FOIA SBA national datasets and subset it to SFDO
Clean up city names, etc.
*/
drop table if exists stg_analytics.sba_sfdo;
create table stg_analytics.sba_sfdo
(
-- Put column definitions here
)
;

insert into stg_analytics.sba_sfdo
select

;
