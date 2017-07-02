/*

This query:
1. Takes the FOIA data and combines the 7A datasets with the 504 dataset.
2. Limits each of the datasets to state of CA and the SFDO counties.
3. Writes the output to a new table.

*/

drop table if exists stg_analytics.sba_sfdo;
create table stg_analytics.sba_sfdo

(
	"Program"	varchar
	,"BorrName"	text
	,"BorrStreet"	text
	,"BorrCity"	text
	,"BorrState"	text
	,"BorrZip"	bigint
	,"GrossApproval"	bigint
	,"ApprovalDate"	timestamp without time zone
	,"ApprovalFiscalYear"	bigint
	,"FirstDisbursementDate"	timestamp without time zone
	,"DeliveryMethod"	text
	,"subpgmdesc"	text
	,"InitialInterestRate"	double precision
	,"TermInMonths"	bigint
	,"NaicsCode"	double precision
	,"NaicsDescription"	text
	,"FranchiseCode"	bigint
	,"FranchiseName"	text
	,"ProjectCounty"	text
	,"ProjectState"	text
	,"SBADistrictOffice"	text
	,"CongressionalDistrict"	double precision
	,"BusinessType"	text
	,"LoanStatus"	text
	,"ChargeOffDate"	timestamp without time zone
	,"GrossChargeOffAmount"	bigint
	,"JobsSupported"	bigint
	,"CDC_Name"	text
	,"CDC_Street"	text
	,"CDC_City"	text
	,"CDC_State"	text
	,"CDC_Zip"	double precision
	,"ThirdPartyLender_Name"	text
	,"ThirdPartyLender_City"	text
	,"ThirdPartyLender_State"	text
	,"ThirdPartyDollars"	double precision
	,"BankName"	text
	,"BankStreet"	text
	,"BankCity"	text
	,"BankState"	text
	,"BankZip"	text
	,"SBAGuaranteedApproval"	bigint
	,"RevolverStatus"	 bigint
);

insert into stg_analytics.sba_sfdo

select

	CAST("Program" as varchar) "Program"
	,"BorrName"
	,"BorrStreet"
	,"BorrCity"
	,"BorrState"
	,"BorrZip"
	,"GrossApproval"
	,"ApprovalDate"
	,"ApprovalFiscalYear"
	,"FirstDisbursementDate"
	,"DeliveryMethod"
	,"subpgmdesc"
	,"InitialInterestRate"
	,"TermInMonths"
	,"NaicsCode"
	,"NaicsDescription"
	,"FranchiseCode"
	,"FranchiseName"
	,"ProjectCounty"
	,"ProjectState"
	,"SBADistrictOffice"
	,"CongressionalDistrict"
	,"BusinessType"
	,"LoanStatus"
	,"ChargeOffDate"
	,"GrossChargeOffAmount"
	,"JobsSupported"
	,"CDC_Name"
	,"CDC_Street"
	,"CDC_City"
	,"CDC_State"
	,"CDC_Zip"
	,"ThirdPartyLender_Name"
	,"ThirdPartyLender_City"
	,"ThirdPartyLender_State"
	,"ThirdPartyDollars"
	,null as "BankName"
	,null as "BankStreet"
	,null as "BankCity"
	,null as "BankState"
	,null as "BankZip"
	,null as "SBAGuaranteedApproval"
	,null as "RevolverStatus"

from data_ingest.sba__foia_504_1991_present

where 
	"BorrState" = 'CA'
and
	"ProjectCounty" in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO', 
                        'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                        'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA', 
                        'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')

union

select

	CAST("Program" as varchar) "Program"
	,"BorrName"
	,"BorrStreet"
	,"BorrCity"
	,"BorrState"
	,"BorrZip"
	,"GrossApproval"
	,"ApprovalDate"
	,"ApprovalFiscalYear"
	,"FirstDisbursementDate"
	,"DeliveryMethod"
	,"subpgmdesc"
	,"InitialInterestRate"
	,"TermInMonths"
	,"NaicsCode"
	,"NaicsDescription"
	,"FranchiseCode"
	,"FranchiseName"
	,"ProjectCounty"
	,"ProjectState"
	,"SBADistrictOffice"
	,"CongressionalDistrict"
	,"BusinessType"
	,"LoanStatus"
	,"ChargeOffDate"
	,"GrossChargeOffAmount"
	,"JobsSupported"
	,null as "CDC_Name"
	,null as "CDC_Street"
	,null as "CDC_City"
	,null as "CDC_State"
	,null as "CDC_Zip"
	,null as "ThirdPartyLender_Name"
	,null as "ThirdPartyLender_City"
	,null as "ThirdPartyLender_State"
	,null as "ThirdPartyDollars"
	,"BankName"
	,"BankStreet"
	,"BankCity"
	,"BankState"
	,"BankZip"
	,"SBAGuaranteedApproval"
	,"RevolverStatus"

from data_ingest.sba__foia_7a_1991_1999

where 
	"BorrState" = 'CA'
and
	"ProjectCounty" in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO', 
                        'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                        'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA', 
                        'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')

union

select

	CAST("Program" as varchar) "Program"
	,"BorrName"
	,"BorrStreet"
	,"BorrCity"
	,"BorrState"
	,"BorrZip"
	,"GrossApproval"
	,"ApprovalDate"
	,"ApprovalFiscalYear"
	,"FirstDisbursementDate"
	,"DeliveryMethod"
	,"subpgmdesc"
	,"InitialInterestRate"
	,"TermInMonths"
	,"NaicsCode"
	,"NaicsDescription"
	,"FranchiseCode"
	,"FranchiseName"
	,"ProjectCounty"
	,"ProjectState"
	,"SBADistrictOffice"
	,"CongressionalDistrict"
	,"BusinessType"
	,"LoanStatus"
	,"ChargeOffDate"
	,"GrossChargeOffAmount"
	,"JobsSupported"
	,null as "CDC_Name"
	,null as "CDC_Street"
	,null as "CDC_City"
	,null as "CDC_State"
	,null as "CDC_Zip"
	,null as "ThirdPartyLender_Name"
	,null as "ThirdPartyLender_City"
	,null as "ThirdPartyLender_State"
	,null as "ThirdPartyDollars"
	,"BankName"
	,"BankStreet"
	,"BankCity"
	,"BankState"
	,"BankZip"
	,"SBAGuaranteedApproval"
	,"RevolverStatus"

from data_ingest.sba__foia_7a_2000_2009

where 
	"BorrState" = 'CA'
and
	"ProjectCounty" in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO', 
                        'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                        'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA', 
                        'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')

union

select

	CAST("Program" as varchar) "Program"
	,"BorrName"
	,"BorrStreet"
	,"BorrCity"
	,"BorrState"
	,"BorrZip"
	,"GrossApproval"
	,"ApprovalDate"
	,"ApprovalFiscalYear"
	,"FirstDisbursementDate"
	,"DeliveryMethod"
	,"subpgmdesc"
	,"InitialInterestRate"
	,"TermInMonths"
	,"NaicsCode"
	,"NaicsDescription"
	,"FranchiseCode"
	,"FranchiseName"
	,"ProjectCounty"
	,"ProjectState"
	,"SBADistrictOffice"
	,"CongressionalDistrict"
	,"BusinessType"
	,"LoanStatus"
	,"ChargeOffDate"
	,"GrossChargeOffAmount"
	,"JobsSupported"
	,null as "CDC_Name"
	,null as "CDC_Street"
	,null as "CDC_City"
	,null as "CDC_State"
	,null as "CDC_Zip"
	,null as "ThirdPartyLender_Name"
	,null as "ThirdPartyLender_City"
	,null as "ThirdPartyLender_State"
	,null as "ThirdPartyDollars"
	,"BankName"
	,"BankStreet"
	,"BankCity"
	,"BankState"
	,"BankZip"
	,"SBAGuaranteedApproval"
	,"RevolverStatus"

from data_ingest.sba__foia_7a_2010_present

where 
	"BorrState" = 'CA'
and
	"ProjectCounty" in ('SANTA CRUZ', 'SANTA CLARA', 'SAN MATEO', 
                        'ALAMEDA', 'CONTRA COSTA', 'MARIN',
                        'SAN FRANCISCO', 'SOLANO', 'NAPA', 'SONOMA', 
                        'LAKE', 'MENDOCINO', 'HUMBOLDT', 'DEL NORTE')
;