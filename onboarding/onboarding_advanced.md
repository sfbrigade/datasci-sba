# Installing Python
We use Anaconda
https://www.continuum.io/downloads

You should download the Python 3 version.

# Setting Up Python Environment
A useful guide to conda environments: https://conda.io/docs/using/envs.html
The two important files are:
1. https://github.com/sfbrigade/datasci-sba/blob/master/environment.yml
2. https://github.com/sfbrigade/datasci-sba/blob/master/requirements.txt

To clone the appropriate python environment, run
`conda env create -f environment.yml`
from the root directory.

See https://conda.io/docs/using/envs.html#use-environment-from-file for more information.

This should create a new conda environment called `datasci-sba` for you.

To activate the conda python environment run
`source activate datasci-sba`

Now, you want to install all the appropriate requirements.

`pip install -r requirements.txt`

# Connecting to our database
In your ~/.bash_profile you need to set up environment variables corresponding to the database credentials. Slack the #datasci-sba group for the appropriate credentials

# Querying tables in our database
See https://github.com/sfbrigade/datasci-sba/blob/master/notebooks/query_sql_template.ipynb as an example to query tables in the database

# Installing Postgres locally
This is technically optional, but it's nice to have a local instance of Postgres running. The easiest way to do this is:
https://postgresapp.com/ (This will only work for Mac)
