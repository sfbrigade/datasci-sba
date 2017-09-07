# Explore the data
## SQL
Use basic SQL to query and explore the data! We now use Mode Analytics as a frontend tool to query our PostgreSQL database hosted on Microsoft Azure. Ping the #datasci-sba Slack Channel if you need access to Mode.
https://modeanalytics.com/editor/code_for_san_francisco

## Data

### Data Sources:

    1. This csv contains the San Francisco-area loans from the original FOIA (Freedom of Information Act) data that is cleared for public use: https://files.slack.com/files-pri/T0431NL8C-F5P0JLZHB/download/foia_sfdo_504_7a.csv This data is updated quarterly.

    2. The FOIA data on the SBA site is divided by loan type and years but also covers a larger geographical area: 

    https://www.sba.gov/about-sba/sba-performance/open-government/foia/frequently-requested-records/sba-7a-504-loan-data-reports

    3. Data Dictionary https://files.slack.com/files-pri/T0431NL8C-F4FQLCV42/download/7a_504_foia_data_dictionary.xlsx

    4. Information about the cities https://files.slack.com/files-pri/T0431NL8C-F4VHWSM28/download/0912_-_city_profiles.xlsx

    5. Information regarding number of small business is provided by the census anually. Business Patterns by County can be found in the Census file CB1500A13. File is available on the American Fact Finder https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=BP_CB1500A13_FTP&prodType=document along with program methodoolgy. The file downloads as .dat, but is a tab delimited file that can be changed to .txt to open locally.

    6. Information regarding number of small business is provided by the census anually. Business Patterns by County can be found in the Census file CB1500CZ21 "ZIP Code Business Statistics: Zip Code Business Patterns by Employment Size Class". File is available on the American Fact Finder https://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=BP_CB1500CZ21_FTP&prodType=document along with program methodoolgy. The file downloads as .dat, but is a tab delimited file that can be changed to .txt to open locally.

    CA is state code '06'

    7. IRS data for mean agi on the county level is available at https://www.irs.gov/uac/soi-tax-stats-county-data-2014. 

    8. Both census small business pattern files and IRS data uses FIPS codes, which may change every year (confirm?). Code reference can be found at https://www.census.gov/geographies/reference-files/2016/demo/popest/2016-fips.html

    County codes in the SFDO area: 

        001 Alameda County
        013 Contra Costa County
        015 Del Norte County
        023 Humboldt County
        033 Lake County
        041 Marin County
        045 Mendocino County
        055 Napa County
        075 San Francisco County
        081 San Mateo County
        085 Santa Clara County
        087 Santa Cruz County
        095 Solano County
        097 Sonoma County

    9. Mean AGI by congressional districts in CA can be found on the Census site (https://www.census.gov/mycd/?st=06&cd=15). Presumably, this mean AGI is comparable to the measure provided by the IRS (but at a congressional district group level).

    10. Small business by congressional district: no source yet, this factfinder page indicates it might be possible to generate based on county business pattern file

    11. Congressional District info by Address: May be found via a few different possible APIs: Google Civic API - https://developers.google.com/civic-information/; Sunlight Foundation API - https://sunlightfoundation.com/api/ 




# Tools used for data exploration, processing, and visualization
We are currently exploring platforms for visualizations accessible for people in the SBA and people who want to learn about the cool stuff that the SBA is up to. However, we have already done a ton of work to set up a Postgres database hosted on Microsoft Azure to formalize the datasets we are working with.

- Postgres DB on Azure - For appropriate credentials to access the database, message the #datasci-sba slack channel.

- Python / Jupyter. There are several notebooks with code to clean and explore the data. The best place to start is [query_sql_template.ipynb](https://github.com/sfbrigade/datasci-sba/blob/master/notebooks/query_sql_template.ipynb)

- Open Refine (http://openrefine.org/) for cleaning data with following steps in JSON https://sfbrigade.slack.com/files/nerb/F5P20FLHJ/clean_sfdo_data.json

- Tableau - Currently the MVP - https://public.tableau.com/profile/zlatan.kremonic#!/vizhome/SBALoans_1/ZIP_Analysis

| Previous | Next |
|:---------|-----:|
| [README](./README.md) | [Development Environment](./02_development_environment.md) |
