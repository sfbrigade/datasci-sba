# Django web-based visualization

This directory contains a Django project powering a visualization of the SBA loan data.

## Apps

The code is split into 2 apps:
- `api_server` contains the models interfacing with the PostgreSQL server, and exposes data with a JSON API
- `web_app` contains some static HTML/CSS/JS running a rich client webapp that consumes the API and renders the visualization

## Running it

For anyone wondering how to run this locally, you can do the following:

1. Set up a local DB and populate it with data (either by dumping the prod DB or by running the pipeline locally, as described [here](../../pipeline/README.md))
1. Set the environment variable for your database URL, e.g. `export SBA_DWH='postgresql://username:password@127.0.0.1:5432/postgres'`
1. Run `python manage.py runserver` from within this directory

This last command gives me
```
(datasci-sba) VincentLa@ch-C02Q6HPBG8WN first_project (django-tutorial) $ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).
August 22, 2017 - 02:19:49
Django version 1.11.3, using settings 'first_project.settings'
Starting development server at http://127.0.0.1:8000/
```

And then go to `http://127.0.0.1:8000/app/` in your browser.

