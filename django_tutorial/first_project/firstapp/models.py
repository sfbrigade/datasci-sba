# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class sba_zip_level(models.Model):
    borr_zip = models.TextField(blank=True, null=False, primary_key=True)
    mean_agi = models.FloatField(blank=True, null=True)
    total_small_bus = models.BigIntegerField(blank=True, null=True)
    total_sba = models.BigIntegerField(blank=True, null=True)
    total_504 = models.BigIntegerField(blank=True, null=True)
    total_7a = models.BigIntegerField(blank=True, null=True)
    sba_per_small_bus = models.FloatField(blank=True, null=True)
    loan_504_per_small_bus = models.FloatField(blank=True, null=True)
    loan_7a_per_small_bus = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sba_zip_level'


class IrsZipData(models.Model):
    state_fips = models.BigIntegerField(blank=True, null=True)
    state = models.TextField(blank=True, null=True)
    zipcode = models.BigIntegerField(blank=True, null=True)
    agi_stub = models.BigIntegerField(blank=True, null=True)
    n1 = models.FloatField(blank=True, null=True)
    mars1 = models.FloatField(blank=True, null=True)
    mars2 = models.FloatField(blank=True, null=True)
    mars4 = models.FloatField(blank=True, null=True)
    prep = models.FloatField(blank=True, null=True)
    n2 = models.FloatField(blank=True, null=True)
    numdep = models.FloatField(blank=True, null=True)
    total_vita = models.FloatField(blank=True, null=True)
    vita = models.FloatField(blank=True, null=True)
    tce = models.FloatField(blank=True, null=True)
    a00100 = models.FloatField(blank=True, null=True)
    n02650 = models.FloatField(blank=True, null=True)
    a02650 = models.FloatField(blank=True, null=True)
    n00200 = models.FloatField(blank=True, null=True)
    a00200 = models.FloatField(blank=True, null=True)
    n00300 = models.FloatField(blank=True, null=True)
    a00300 = models.FloatField(blank=True, null=True)
    n00600 = models.FloatField(blank=True, null=True)
    a00600 = models.FloatField(blank=True, null=True)
    n00650 = models.FloatField(blank=True, null=True)
    a00650 = models.FloatField(blank=True, null=True)
    n00700 = models.FloatField(blank=True, null=True)
    a00700 = models.FloatField(blank=True, null=True)
    n00900 = models.FloatField(blank=True, null=True)
    a00900 = models.FloatField(blank=True, null=True)
    n01000 = models.FloatField(blank=True, null=True)
    a01000 = models.FloatField(blank=True, null=True)
    n01400 = models.FloatField(blank=True, null=True)
    a01400 = models.FloatField(blank=True, null=True)
    n01700 = models.FloatField(blank=True, null=True)
    a01700 = models.FloatField(blank=True, null=True)
    schf = models.FloatField(blank=True, null=True)
    n02300 = models.FloatField(blank=True, null=True)
    a02300 = models.FloatField(blank=True, null=True)
    n02500 = models.FloatField(blank=True, null=True)
    a02500 = models.FloatField(blank=True, null=True)
    n26270 = models.FloatField(blank=True, null=True)
    a26270 = models.FloatField(blank=True, null=True)
    n02900 = models.FloatField(blank=True, null=True)
    a02900 = models.FloatField(blank=True, null=True)
    n03220 = models.FloatField(blank=True, null=True)
    a03220 = models.FloatField(blank=True, null=True)
    n03300 = models.FloatField(blank=True, null=True)
    a03300 = models.FloatField(blank=True, null=True)
    n03270 = models.FloatField(blank=True, null=True)
    a03270 = models.FloatField(blank=True, null=True)
    n03150 = models.FloatField(blank=True, null=True)
    a03150 = models.FloatField(blank=True, null=True)
    n03210 = models.FloatField(blank=True, null=True)
    a03210 = models.FloatField(blank=True, null=True)
    n03230 = models.FloatField(blank=True, null=True)
    a03230 = models.FloatField(blank=True, null=True)
    n03240 = models.FloatField(blank=True, null=True)
    a03240 = models.FloatField(blank=True, null=True)
    n04470 = models.FloatField(blank=True, null=True)
    a04470 = models.FloatField(blank=True, null=True)
    a00101 = models.FloatField(blank=True, null=True)
    n18425 = models.FloatField(blank=True, null=True)
    a18425 = models.FloatField(blank=True, null=True)
    n18450 = models.FloatField(blank=True, null=True)
    a18450 = models.FloatField(blank=True, null=True)
    n18500 = models.FloatField(blank=True, null=True)
    a18500 = models.FloatField(blank=True, null=True)
    n18300 = models.FloatField(blank=True, null=True)
    a18300 = models.FloatField(blank=True, null=True)
    n19300 = models.FloatField(blank=True, null=True)
    a19300 = models.FloatField(blank=True, null=True)
    n19700 = models.FloatField(blank=True, null=True)
    a19700 = models.FloatField(blank=True, null=True)
    n04800 = models.FloatField(blank=True, null=True)
    a04800 = models.FloatField(blank=True, null=True)
    n05800 = models.FloatField(blank=True, null=True)
    a05800 = models.FloatField(blank=True, null=True)
    n09600 = models.FloatField(blank=True, null=True)
    a09600 = models.FloatField(blank=True, null=True)
    n05780 = models.FloatField(blank=True, null=True)
    a05780 = models.FloatField(blank=True, null=True)
    n07100 = models.FloatField(blank=True, null=True)
    a07100 = models.FloatField(blank=True, null=True)
    n07300 = models.FloatField(blank=True, null=True)
    a07300 = models.FloatField(blank=True, null=True)
    n07180 = models.FloatField(blank=True, null=True)
    a07180 = models.FloatField(blank=True, null=True)
    n07230 = models.FloatField(blank=True, null=True)
    a07230 = models.FloatField(blank=True, null=True)
    n07240 = models.FloatField(blank=True, null=True)
    a07240 = models.FloatField(blank=True, null=True)
    n07220 = models.FloatField(blank=True, null=True)
    a07220 = models.FloatField(blank=True, null=True)
    n07260 = models.FloatField(blank=True, null=True)
    a07260 = models.FloatField(blank=True, null=True)
    n09400 = models.FloatField(blank=True, null=True)
    a09400 = models.FloatField(blank=True, null=True)
    n85770 = models.FloatField(blank=True, null=True)
    a85770 = models.FloatField(blank=True, null=True)
    n85775 = models.FloatField(blank=True, null=True)
    a85775 = models.FloatField(blank=True, null=True)
    n09750 = models.FloatField(blank=True, null=True)
    a09750 = models.FloatField(blank=True, null=True)
    n10600 = models.FloatField(blank=True, null=True)
    a10600 = models.FloatField(blank=True, null=True)
    n59660 = models.FloatField(blank=True, null=True)
    a59660 = models.FloatField(blank=True, null=True)
    n59720 = models.FloatField(blank=True, null=True)
    a59720 = models.FloatField(blank=True, null=True)
    n11070 = models.FloatField(blank=True, null=True)
    a11070 = models.FloatField(blank=True, null=True)
    n10960 = models.FloatField(blank=True, null=True)
    a10960 = models.FloatField(blank=True, null=True)
    n11560 = models.FloatField(blank=True, null=True)
    a11560 = models.FloatField(blank=True, null=True)
    n06500 = models.FloatField(blank=True, null=True)
    a06500 = models.FloatField(blank=True, null=True)
    n10300 = models.FloatField(blank=True, null=True)
    a10300 = models.FloatField(blank=True, null=True)
    n85530 = models.FloatField(blank=True, null=True)
    a85530 = models.FloatField(blank=True, null=True)
    n85300 = models.FloatField(blank=True, null=True)
    a85300 = models.FloatField(blank=True, null=True)
    n11901 = models.FloatField(blank=True, null=True)
    a11901 = models.FloatField(blank=True, null=True)
    n11902 = models.FloatField(blank=True, null=True)
    a11902 = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'irs__zip_data'


class SbaFoia5041991Present(models.Model):
    program = models.BigIntegerField(blank=True, null=True)
    borr_name = models.TextField(blank=True, null=True)
    borr_street = models.TextField(blank=True, null=True)
    borr_city = models.TextField(blank=True, null=True)
    borr_state = models.TextField(blank=True, null=True)
    borr_zip = models.BigIntegerField(blank=True, null=True)
    cdc_name = models.TextField(blank=True, null=True)
    cdc_street = models.TextField(blank=True, null=True)
    cdc_city = models.TextField(blank=True, null=True)
    cdc_state = models.TextField(blank=True, null=True)
    cdc_zip = models.FloatField(blank=True, null=True)
    third_party_lender_name = models.TextField(blank=True, null=True)
    third_party_lender_city = models.TextField(blank=True, null=True)
    third_party_lender_state = models.TextField(blank=True, null=True)
    third_party_dollars = models.FloatField(blank=True, null=True)
    gross_approval = models.BigIntegerField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    approval_fiscal_year = models.BigIntegerField(blank=True, null=True)
    first_disbursement_date = models.DateTimeField(blank=True, null=True)
    delivery_method = models.TextField(blank=True, null=True)
    subprogram_description = models.TextField(blank=True, null=True)
    initial_interest_rate = models.FloatField(blank=True, null=True)
    term_in_months = models.BigIntegerField(blank=True, null=True)
    naics_code = models.FloatField(blank=True, null=True)
    naics_description = models.TextField(blank=True, null=True)
    franchise_code = models.BigIntegerField(blank=True, null=True)
    franchise_name = models.TextField(blank=True, null=True)
    project_county = models.TextField(blank=True, null=True)
    project_state = models.TextField(blank=True, null=True)
    sba_district_office = models.TextField(blank=True, null=True)
    congressional_district = models.FloatField(blank=True, null=True)
    business_type = models.TextField(blank=True, null=True)
    loan_status = models.TextField(blank=True, null=True)
    chargeoff_date = models.DateTimeField(blank=True, null=True)
    gross_chargeoff_amount = models.BigIntegerField(blank=True, null=True)
    jobs_supported = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sba__foia_504_1991_present'


class SbaFoia7A19911999(models.Model):
    program = models.TextField(blank=True, null=True)
    borr_name = models.TextField(blank=True, null=True)
    borr_street = models.TextField(blank=True, null=True)
    borr_city = models.TextField(blank=True, null=True)
    borr_state = models.TextField(blank=True, null=True)
    borr_zip = models.BigIntegerField(blank=True, null=True)
    bank_name = models.TextField(blank=True, null=True)
    bank_street = models.TextField(blank=True, null=True)
    bank_city = models.TextField(blank=True, null=True)
    bank_state = models.TextField(blank=True, null=True)
    bank_zip = models.TextField(blank=True, null=True)
    gross_approval = models.BigIntegerField(blank=True, null=True)
    sba_guaranteed_approval = models.BigIntegerField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    approval_fiscal_year = models.BigIntegerField(blank=True, null=True)
    first_disbursement_date = models.DateTimeField(blank=True, null=True)
    delivery_method = models.TextField(blank=True, null=True)
    subprogram_description = models.TextField(blank=True, null=True)
    initial_interest_rate = models.FloatField(blank=True, null=True)
    term_in_months = models.BigIntegerField(blank=True, null=True)
    naics_code = models.FloatField(blank=True, null=True)
    naics_description = models.TextField(blank=True, null=True)
    franchise_code = models.BigIntegerField(blank=True, null=True)
    franchise_name = models.TextField(blank=True, null=True)
    project_county = models.TextField(blank=True, null=True)
    project_state = models.TextField(blank=True, null=True)
    sba_district_office = models.TextField(blank=True, null=True)
    congressional_district = models.FloatField(blank=True, null=True)
    business_type = models.TextField(blank=True, null=True)
    loan_status = models.TextField(blank=True, null=True)
    chargeoff_date = models.DateTimeField(blank=True, null=True)
    gross_chargeoff_amount = models.BigIntegerField(blank=True, null=True)
    revolver_status = models.BigIntegerField(blank=True, null=True)
    jobs_supported = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sba__foia_7a_1991_1999'


class SbaFoia7A20002009(models.Model):
    program = models.TextField(blank=True, null=True)
    borr_name = models.TextField(blank=True, null=True)
    borr_street = models.TextField(blank=True, null=True)
    borr_city = models.TextField(blank=True, null=True)
    borr_state = models.TextField(blank=True, null=True)
    borr_zip = models.BigIntegerField(blank=True, null=True)
    bank_name = models.TextField(blank=True, null=True)
    bank_street = models.TextField(blank=True, null=True)
    bank_city = models.TextField(blank=True, null=True)
    bank_state = models.TextField(blank=True, null=True)
    bank_zip = models.TextField(blank=True, null=True)
    gross_approval = models.BigIntegerField(blank=True, null=True)
    sba_guaranteed_approval = models.BigIntegerField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    approval_fiscal_year = models.BigIntegerField(blank=True, null=True)
    first_disbursement_date = models.DateTimeField(blank=True, null=True)
    delivery_method = models.TextField(blank=True, null=True)
    subprogram_description = models.TextField(blank=True, null=True)
    initial_interest_rate = models.FloatField(blank=True, null=True)
    term_in_months = models.BigIntegerField(blank=True, null=True)
    naics_code = models.FloatField(blank=True, null=True)
    naics_description = models.TextField(blank=True, null=True)
    franchise_code = models.BigIntegerField(blank=True, null=True)
    franchise_name = models.TextField(blank=True, null=True)
    project_county = models.TextField(blank=True, null=True)
    project_state = models.TextField(blank=True, null=True)
    sba_district_office = models.TextField(blank=True, null=True)
    congressional_district = models.FloatField(blank=True, null=True)
    business_type = models.TextField(blank=True, null=True)
    loan_status = models.TextField(blank=True, null=True)
    chargeoff_date = models.DateTimeField(blank=True, null=True)
    gross_chargeoff_amount = models.BigIntegerField(blank=True, null=True)
    revolver_status = models.BigIntegerField(blank=True, null=True)
    jobs_supported = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sba__foia_7a_2000_2009'


class SbaFoia7A2010Present(models.Model):
    program = models.TextField(blank=True, null=True)
    borr_name = models.TextField(blank=True, null=True)
    borr_street = models.TextField(blank=True, null=True)
    borr_city = models.TextField(blank=True, null=True)
    borr_state = models.TextField(blank=True, null=True)
    borr_zip = models.BigIntegerField(blank=True, null=True)
    bank_name = models.TextField(blank=True, null=True)
    bank_street = models.TextField(blank=True, null=True)
    bank_city = models.TextField(blank=True, null=True)
    bank_state = models.TextField(blank=True, null=True)
    bank_zip = models.TextField(blank=True, null=True)
    gross_approval = models.BigIntegerField(blank=True, null=True)
    sba_guaranteed_approval = models.BigIntegerField(blank=True, null=True)
    approval_date = models.DateTimeField(blank=True, null=True)
    approval_fiscal_year = models.BigIntegerField(blank=True, null=True)
    first_disbursement_date = models.DateTimeField(blank=True, null=True)
    delivery_method = models.TextField(blank=True, null=True)
    subprogram_description = models.TextField(blank=True, null=True)
    initial_interest_rate = models.FloatField(blank=True, null=True)
    term_in_months = models.BigIntegerField(blank=True, null=True)
    naics_code = models.FloatField(blank=True, null=True)
    naics_description = models.TextField(blank=True, null=True)
    franchise_code = models.BigIntegerField(blank=True, null=True)
    franchise_name = models.TextField(blank=True, null=True)
    project_county = models.TextField(blank=True, null=True)
    project_state = models.TextField(blank=True, null=True)
    sba_district_office = models.TextField(blank=True, null=True)
    congressional_district = models.FloatField(blank=True, null=True)
    business_type = models.TextField(blank=True, null=True)
    loan_status = models.TextField(blank=True, null=True)
    chargeoff_date = models.DateTimeField(blank=True, null=True)
    gross_chargeoff_amount = models.BigIntegerField(blank=True, null=True)
    revolver_status = models.BigIntegerField(blank=True, null=True)
    jobs_supported = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sba__foia_7a_2010_present'
