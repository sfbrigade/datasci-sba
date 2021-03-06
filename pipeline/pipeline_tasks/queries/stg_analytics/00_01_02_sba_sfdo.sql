/*

This query:
1. Takes the FOIA data and combines the 7A datasets with the 504 dataset.
2. Limits each of the datasets to state of CA and the SFDO counties.
3. Writes the output to a new table.

*/

drop table if exists stg_analytics.sba_sfdo;
create table stg_analytics.sba_sfdo
(
program text,
borr_name text,
borr_street text,
borr_city text,
borr_state text,
borr_zip text,
gross_approval bigint,
approval_date timestamp without time zone,
approval_fiscal_year bigint,
first_disbursement_date timestamp without time zone,
delivery_method text,
subprogram_description text,
initial_interest_rate double precision,
term_in_months bigint,
naics_code double precision,
naics_description text,
franchise_code text,
franchise_name text,
project_county text,
project_state text,
sba_district_office text,
congressional_district double precision,
business_type text,
loan_status text,
chargeoff_date timestamp without time zone,
gross_chargeoff_amount bigint,
jobs_supported bigint,
cdc_name text,
cdc_street text,
cdc_city text,
cdc_state text,
cdc_zip text,
third_party_lender_name text,
third_party_lender_city text,
third_party_lender_state text,
third_party_dollars double precision,
bank_name text,
bank_street text,
bank_city text,
bank_state text,
bank_zip text,
sba_guaranteed_approval bigint,
revolver_status bigint
-- We also add a surrogate primary key sba_sfdo_id below
);

insert into stg_analytics.sba_sfdo

select
  program::text as program,
  borr_name,
  borr_street,
  borr_city,
  borr_state,
  borr_zip,
  gross_approval,
  approval_date,
  approval_fiscal_year,
  first_disbursement_date,
  delivery_method,
  subprogram_description,
  initial_interest_rate,
  term_in_months,
  naics_code,
  naics_description,
  franchise_code,
  franchise_name,
  project_county,
  project_state,
  regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') as sba_district_office,
  congressional_district,
  business_type,
  loan_status,
  chargeoff_date,
  gross_chargeoff_amount,
  jobs_supported,
  cdc_name,
  cdc_street,
  cdc_city,
  cdc_state,
  cdc_zip,
  third_party_lender_name,
  third_party_lender_city,
  third_party_lender_state,
  third_party_dollars,
  null as bank_name,
  null as bank_street,
  null as bank_city,
  null as bank_state,
  null as bank_zip,
  null as sba_guaranteed_approval,
  null as revolver_status

from data_ingest.sba__foia_504_1991_present

where borr_state = 'CA'
  and project_county in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO',
                         'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                         'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA',
                         'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')
  and regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') = 'SAN FRANCISCO DISTRICT OFFICE'
;

insert into stg_analytics.sba_sfdo
select
  program::text as program,
  borr_name,
  borr_street,
  borr_city,
  borr_state,
  borr_zip,
  gross_approval,
  approval_date,
  approval_fiscal_year,
  first_disbursement_date,
  delivery_method,
  subprogram_description,
  initial_interest_rate,
  term_in_months,
  naics_code,
  naics_description,
  franchise_code,
  franchise_name,
  project_county,
  project_state,
  regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') as sba_district_office,
  congressional_district,
  business_type,
  loan_status,
  chargeoff_date,
  gross_chargeoff_amount,
  jobs_supported,
  null as cdc_name,
  null as cdc_street,
  null as cdc_city,
  null as cdc_state,
  null as cdc_zip,
  null as third_party_lender_name,
  null as third_party_lender_city,
  null as third_party_lender_state,
  null as third_party_dollars,
  bank_name,
  bank_street,
  bank_city,
  bank_state,
  bank_zip,
  sba_guaranteed_approval,
  revolver_status
from data_ingest.sba__foia_7a_1991_1999
where borr_state = 'CA'
  and project_county in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO',
                         'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                         'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA',
                         'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')
  and regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') = 'SAN FRANCISCO DISTRICT OFFICE'
;

insert into stg_analytics.sba_sfdo
select
  program::text as program,
  borr_name,
  borr_street,
  borr_city,
  borr_state,
  borr_zip,
  gross_approval,
  approval_date,
  approval_fiscal_year,
  first_disbursement_date,
  delivery_method,
  subprogram_description,
  initial_interest_rate,
  term_in_months,
  naics_code,
  naics_description,
  franchise_code,
  franchise_name,
  project_county,
  project_state,
  regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') as sba_district_office,
  congressional_district,
  business_type,
  loan_status,
  chargeoff_date,
  gross_chargeoff_amount,
  jobs_supported,
  null as cdc_name,
  null as cdc_street,
  null as cdc_city,
  null as cdc_state,
  null as cdc_zip,
  null as third_party_lender_name,
  null as third_party_lender_city,
  null as third_party_lender_state,
  null as third_party_dollars,
  bank_name,
  bank_street,
  bank_city,
  bank_state,
  bank_zip,
  sba_guaranteed_approval,
  revolver_status
from data_ingest.sba__foia_7a_2000_2009
where borr_state = 'CA'
  and project_county in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO',
                         'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                         'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA',
                         'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')
  and regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') = 'SAN FRANCISCO DISTRICT OFFICE'
;

insert into stg_analytics.sba_sfdo
select
  program::text as program,
  borr_name,
  borr_street,
  borr_city,
  borr_state,
  borr_zip,
  gross_approval,
  approval_date,
  approval_fiscal_year,
  first_disbursement_date,
  delivery_method,
  subprogram_description,
  initial_interest_rate,
  term_in_months,
  naics_code,
  naics_description,
  franchise_code,
  franchise_name,
  project_county,
  project_state,
  regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') as sba_district_office,
  congressional_district,
  business_type,
  loan_status,
  chargeoff_date,
  gross_chargeoff_amount,
  jobs_supported,
  null as cdc_name,
  null as cdc_street,
  null as cdc_city,
  null as cdc_state,
  null as cdc_zip,
  null as third_party_lender_name,
  null as third_party_lender_city,
  null as third_party_lender_state,
  null as third_party_dollars,
  bank_name,
  bank_street,
  bank_city,
  bank_state,
  bank_zip,
  sba_guaranteed_approval,
  revolver_status
from data_ingest.sba__foia_7a_2010_present
where borr_state = 'CA'
  and project_county in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO',
                         'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                         'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA',
                         'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')
  and regexp_replace(sba_district_office, '[^(a-zA-Z| )]', '', 'g') = 'SAN FRANCISCO DISTRICT OFFICE'
;

-- Adding surrogate primary key
alter table stg_analytics.sba_sfdo add column sba_sfdo_id serial primary key;

-- Creating Indices
create index on stg_analytics.sba_sfdo (borr_zip);
