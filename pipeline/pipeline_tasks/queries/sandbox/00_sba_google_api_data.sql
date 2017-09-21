/*

This query takes a subset of fields from the sba_google_api_data parse table
and copies them into a sandbox.sba_google_api_data along with joining ids
to the stg_analytics.sba_sfdo table.  This allows the web app to do easy lookups
by joining the 2 tables.

*/

drop table if exists sandbox.sba_google_api_data;
create table sandbox.sba_google_api_data
(
id serial primary key,
sba_sfdo_id int references stg_analytics.sba_sfdo(sba_sfdo_id),
latitude double precision,
longitude double precision,
google_rating double precision
);



insert into sandbox.sba_google_api_data
  (
  sba_sfdo_id,
  latitude,
  longitude,
  google_rating
  )
select distinct on (sba_sfdo.sba_sfdo_id)
  sba_sfdo.sba_sfdo_id,
  sba__google_places_loan_data.dstklatitude AS latitude,
  sba__google_places_loan_data.dstklong AS longitude,
  sba__google_places_loan_data.googlerating AS google_rating
from stg_analytics.sba_sfdo
left join sandbox.sba__google_places_loan_data
  on UPPER(sba_sfdo.borr_name) = UPPER(sba__google_places_loan_data.borrname);