# Explore the data
## SQL
Use basic SQL to query and explore the data! A version of the data has been uploaded to Mode, a reporting tool, and can be explored:
https://modeanalytics.com/editor/vincentla/reports/4124e51db598

## Data
This csv contains the San Francisco-area loans from the original FOIA (Freedom of Information Act) data that is cleared for public use:
https://files.slack.com/files-pri/T0431NL8C-F5P0JLZHB/download/foia_sfdo_504_7a.csv

The FOIA data on the SBA site is divided by loan type and years but also covers a larger geographical area: 
https://www.sba.gov/about-sba/sba-performance/open-government/foia/frequently-requested-records/sba-7a-504-loan-data-reports

The data is also available on the Data Science team's Azure account here:      
https://c4sfdatascience.blob.core.windows.net/sba/FOIA%20-%20504%20(FY1991-Present).xlsx

Data Dictionary https://files.slack.com/files-pri/T0431NL8C-F4FQLCV42/download/7a_504_foia_data_dictionary.xlsx

Information about the cities https://files.slack.com/files-pri/T0431NL8C-F4VHWSM28/download/0912_-_city_profiles.xlsx


# Tools used for data exploration, processing, and visualization
We are currently exploring platforms for visualizations accessible for people in the SBA and people who want to learn about the cool stuff that the SBA is up to. However, we have already done a ton of work to set up a Postgres database hosted on Microsoft Azure to formalize the datasets we are working with.

- Postgres DB on Azure - For appropriate credentials to access the database, message the #datasci-sba slack channel.

- Python / Jupyter. There are several notebooks with code to clean and explore the data. The best place to start is [query_sql_template.ipynb](https://github.com/sfbrigade/datasci-sba/blob/master/notebooks/query_sql_template.ipynb)

- Open Refine (http://openrefine.org/) for cleaning data with following steps in JSON https://sfbrigade.slack.com/files/nerb/F5P20FLHJ/clean_sfdo_data.json

- Tableau - Currently the MVP - https://public.tableau.com/profile/zlatan.kremonic#!/vizhome/SBALoans_1/ZIP_Analysis

| Previous | Next |
|:---------|-----:|
| [README](./README.md) | [Development Environment](./02_development_environment.md) |
