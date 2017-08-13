# Source Data
This folder holds all the source data (e.g. CSV files, Excel Spreadsheets) that are the raw data that get loaded into the Database with scripts located in the [pipeline](../pipeline) directory.

Eventually, the hope is to host all the raw data on Microsoft Azure and point our parsers to that location. However, until we get that figured out, the `pipeline_runner` assumes that all the raw data files are located in `datasci-sba/src/data` directory. If you want to run the [pipeline_runner.py](../pipeline/pipeline_runner.py) locally, you will have to make sure you download the raw data sets into this directory.

We've temporarily put all the necessary raw data in this [Dropbox folder](https://www.dropbox.com/sh/tpw6r92l4xnmg7z/AACjaMwpZaQpmsRStjzJifk8a?dl=0)

Replace the local contents of your `datasci-sba/src/data` directory with the contents of the above Dropbox folder.