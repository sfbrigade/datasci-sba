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

There are two important files [environment.yml](../environment.yml) and [requirements.txt](../requirements.txt). The `environment.yml` file is a file that contains all the requirements for the Anaconda environment. Remember, that Anaconda is Python centric, but not Python exclusive, which means we can use Anaconda to manage packages for other things, such as Django or even R. The `requirements.txt` file is for python specific package dependencies.

1. To clone the appropriate python environment, run, from the root directory (See https://conda.io/docs/using/envs.html#use-environment-from-file for more information):
```
conda env create -f environment.yml
```

This should create a new conda environment called `datasci-sba` for you.

2. To activate the conda python environment run
```
source activate datasci-sba
```

You need to activate the python environment every time you open a new terminal window.

3. Install all the appropriate python requirements.
```
pip install -r requirements.txt
```

4. Updating environments -- in the future, to update Anaconda environment, you can run
```
conda env update -n=datasci-sba -f=environment.yml
```

To update python requirements,
```
pip install -r requirements.txt
```

## Installing Postgres locally
Installing postgres locally is technically optional, but will be really useful if you want to use `psql` command line tool. 

### For Mac
You can also install Postgres via HomeBrew: https://brew.sh/

`brew install postgres`

### For PC
To download Postgres: http://oscg-downloads.s3.amazonaws.com/packages/PostgreSQL-9.6.2-2-win64-bigsql.exe

For further instructions: https://medium.com/@colinrubbert/installing-ruby-on-rails-in-windows-10-w-bash-postgresql-e48e55954fbf

## Tech Stack

Here are the technologies used in the project, along with some tutorials if you'd like to learn.

| Tech | Version | Purpose | Getting Started |
|------|---------|---------|-----------------|
| Git | 2.4+ | Version control | [Udacity course](https://classroom.udacity.com/courses/ud775), [good comprehensive online book](https://git-scm.com/book/en/v2) |
| Postgres | 9.6 | Database | [Tutorial](https://www.postgresql.org/docs/8.0/static/tutorial.html) |
| SQL | |  Language used for database queries | [Tutorial from Postgres site](https://www.postgresql.org/docs/8.0/static/tutorial-sql.html) |
| Python | v3 | Data Analysis & Webserver | [Anaconda](https://www.continuum.io/downloads), [Python Language Tutorial](https://docs.python.org/3/tutorial/) |
| SciPy | | Python packages for data analysis | [Intro to Pandas](http://pandas.pydata.org/pandas-docs/stable/10min.html), [NumPy Tutorial](https://docs.scipy.org/doc/numpy-dev/user/quickstart.html) |
| Jupyter | | Easily share Python analysis with code and results | [Quickstart guide](https://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/) |
| Django | 1.11.4 | Python webserver | Read the tutorial [here](https://docs.djangoproject.com/en/1.11/intro/), but install using `conda install django` |
| Javascript | ES2015 / ES6 | Clientside scripting language | [Tutorial covering modern JS](https://javascript.info/), [Quick reference of ES6 features](http://es6-features.org/) |
| Redux | 3.7.2 | Clientside state management | [Docs](http://redux.js.org/), [Good introductory videos](https://egghead.io/courses/getting-started-with-redux) |
| jQuery | 3.2.1 | Clientside DOM manipulation | [Tutorial](https://www.tutorialspoint.com/jquery/jquery-overview.htm) |

| Previous | Next |
|:---------|-----:|
| [Exploring the Data](./01_exploring_the_data.md) | [Tips and Tricks](./03_tips_and_tricks.md) |

