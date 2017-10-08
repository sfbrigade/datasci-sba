import cenpy as c
import pandas as pd
'''Sync Census API call to pipeline_runner.py'''

#alternative, : https://data2.nhgis.org/main (csvs are still a mess)
#summation of what 1 year vs 5 year estimate means: https://www.census.gov/programs-surveys/acs/guidance/estimates.html

#American Community Survey 5-year estimate
conn = c.base.Connection('ACSSF5Y2015')


#Ethnicities(in order): All, White, Black, Asian, Hispanic
income_ethinicity_cols = ['B19001_001E','B19001A_001E','B19001B_001E' , 'B19001D_001E', 'B19001I_001E','NAME']


#geographies information here: https://www.census.gov/programs-surveys/acs/geography-acs/concepts-definitions.html
county_data = conn.query(income_ethinicity_cols, geo_unit = 'county:*', geo_filter = {'state':'06'})
congressional_data = conn.query(income_ethinicity_cols, geo_unit = 'congressional district:*', geo_filter = {'state':'06'})
city_data = conn.query(income_ethinicity_cols, geo_unit = 'place:*', geo_filter = {'state':'06'})
zipcode_data = conn.query(income_ethinicity_cols, geo_unit = 'zip code tabulation area:*')

#Rename income_ethinicity_cols names
ethnicity_names = ['All' , 'White', 'Black', 'Asian', 'Hispanic']

#Rename columns in congressional and county
congressional_data.columns = ethnicity_names + list(congressional_data.columns[5:])
county_data.columns = ethnicity_names + list(county_data.columns[5:])
city_data.columns = ethnicity_names + list(city_data.columns[5:])
zipcode_data.columns = ethnicity_names + list(zipcode_data.columns[5:])


#adding the majority ethnicity
congressional_data["majority_ethnicity"] = congressional_data[ethnicity_names[1:]].idxmax(axis=1)
county_data["majority_ethnicity"] = county_data[ethnicity_names[1:]].idxmax(axis=1)
city_data["majority_ethnicity"] = city_data[ethnicity_names[1:]].idxmax(axis=1)
zipcode_data["majority_ethnicity"] = zipcode_data[ethnicity_names[1:]].idxmax(axis=1)
