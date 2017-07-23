# Development Environment Setup
In this doc, we will go through things you need to install to get on the right "development environment" so that you can start contributing.

If you're on a Mac or PC you should be fine. The only caveat is that with PC, I would highly recommend using [Bash on ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about) which provides a Linux environment without needing to spin up an entire Linux virtual machine! I also think working in a unix-like environment is great experience, especially in the tech world.

The following things that **must** be done are:

1. Installing Python (I highly recommend Python3 with the Anaconda distribution)
2. Clone the Repository
3. Connect to our database

Things that aren't absolutely necessary to start contributing, but I would still recommend doing are:

1. Working in a python environment (using conda)
2. Installing Postgres locally

## Installing Python
We use Anaconda
https://www.continuum.io/downloads

You should download the Python 3 version.

## Clone the Repository
`git clone https://github.com/sfbrigade/datasci-sba.git`

## Connecting to our database
In your ~/.bash_profile you need to set up environment variables corresponding to the database credentials. Slack the #datasci-sba group for the appropriate credentials

The following below aren't absolutely necessary, but are pretty helpful.

## Setting Up Python Environment
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

You need to activate the python environment every time you open a new terminal window.

Now, you want to install all the appropriate requirements.

`pip install -r requirements.txt`

## Installing Postgres locally
Installing postgres locally is technically optional, but will be really useful if you want to use `psql` command line tool. 

### For Mac
You can also install Postgres via HomeBrew: https://brew.sh/

`brew install postgres`

### For PC
To download Postgres: http://oscg-downloads.s3.amazonaws.com/packages/PostgreSQL-9.6.2-2-win64-bigsql.exe

For further instructions: https://medium.com/@colinrubbert/installing-ruby-on-rails-in-windows-10-w-bash-postgresql-e48e55954fbf

| Previous | Next |
|:---------|-----:|
| [Exploring the Data](./01_exploring_the_data.md) | [Tips and Tricks](./03_tips_and_tricks.md) |
