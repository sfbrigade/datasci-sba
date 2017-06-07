# What is the SBA project about?

## Context 
This project is focused on working with Small Business Administration (SBA) data in the hopes of rendering trends in the use of small business loans visible in order to assist in the administration of San Feancisco-area loans and answer questions like:
- How actively are different communities or areas taking advantage of available loans? Are there areas that could benefit from learning about SBA resources?
- What are some success stories among SBA loan recipients that can help the the SBA garner more support - and benefit more small businesses?



## The details
See the README.md for some high level details here: https://github.com/sfbrigade/datasci-sba/blob/master/README.md

See this google doc for more specific problem statements: https://docs.google.com/document/d/1snCqR35VbrRRzY35Okvrc7iNjOx-uy5GpmxDm1wvCJ4/edit?usp=sharing



# Get connected!

## Slack
Join the SF Brigade Slack Group by entering your email & getting an invite here: 
https://sfbrigade-slackin.herokuapp.com/  Our Slack channel is #datasci-sba


## Task Management
We use Trello for task management. Reach out to our slack channel (#datasci-sba) to get access if you don't have it already. Check out our board to see the status of various parts of the project: 
https://trello.com/b/LMZl7omg/sba-project

Use Trello instead of the google docs (project tracker and project needs) pinned in slack. They are old.  


# Explore the data
## SQL
Use basic SQL to query and explore the data! A version of the data has been uploaded to Mode, a reporting tool, and can be explored:
https://modeanalytics.com/editor/vincentla/reports/4124e51db598

## Data
Download the original FOIA (Freedom of Information Act) data here & explore it however you like: 
https://www.sba.gov/about-sba/sba-performance/open-government/foia/frequently-requested-records/sba-7a-504-loan-data-reports

The data is also available on the Data Science team's Azure account here:      QUESTION - which version of the data is this?
https://c4sfdatascience.blob.core.windows.net/sba/FOIA%20-%20504%20(FY1991-Present).xlsx

Data Dictionary https://files.slack.com/files-pri/T0431NL8C-F4FQLCV42/download/7a_504_foia_data_dictionary.xlsx

Information about the cities https://files.slack.com/files-pri/T0431NL8C-F4VHWSM28/download/0912_-_city_profiles.xlsx


# Platforms
We are currently exploring platforms for rendering the data and visualizations accessible for people in the SBA and people who want to learn about the cool stuff that the SBA is up to. Everything in this section is up for grabs currently, but - so far - initial efforts have been made to make the data available on the following platforms:

- Python / Jupyter. There are several notebooks with code to clean and explore the data. 
  - SBA Data Integration.ipynb - Provides the steps for integrating the original FOIA SBA data with zip code level data on businesses and  IRS tax return data
  - yelp.py - uses BeautifulSoup and Requests to pull yelp data.
  
- Mode - Primarily to explore the data.  https://modeanalytics.com/editor/vincentla/reports/4124e51db598

- Heroku - An initial effort to make the data available online.  https://datasci-sba-metabase.herokuapp.com

- Azure - Still in process. This will likely house the cleaned up data.

