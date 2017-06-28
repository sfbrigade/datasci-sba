drop table if exists stg_analytics.zip_agi;
create table stg_analytics.zip_agi
(
PUT COLUMN DEFINITIONS HERE
);

insert into stg_analytics.zip_agi
select
  columns,
  A00100 / (N1 + MARS2) * 1000 as mean_agi
;
