# Pipeline Runner
This pipeline runner is a way to keep all tasks hitting our database in a central location. The value of this, is that we can recreate the state of our database very easily, and we know where are all the tasks that are writing to our database.

The entry point into the pipeline runner is [pipeline_runner.py](./pipeline_runner.py). In this file, we essentially create a `for` loop that loops through all the files in a list and executes them. Currently we only support `.sql` and `.py` files.

## Adding Additional Files
To add additional files to run, add the file name to the appropriate list object.

To run the pipeline, you need to have the connection string stored as an environment variable. You will also need to have Python3 installed as well as necessary dependencies specified in `requirements.txt`. Please see the [development environment onboarding doc](https://github.com/sfbrigade/datasci-sba/blob/master/onboarding/02_development_environment.md) for more information.

## Running the Pipeline Runner
To actually run `pipeline_runner.py` you need to first be in the root folder of the repository. `cd` into that. For example
```
cd ~/git/datasci-sba
```

In addition (especially if you are running the pipeline end-to-end including parsing the raw CSV/Excel files to load into the Database), you will need to have the data in the proper location: `datasci-sba/src/data`. See this [README file](../src/README.md) for further documentation and Dropbox location for the appropriate files.

Now to run the `pipeline_runner.py`:
```
python -m pipeline.pipeline_runner --db_url=$SBA_DWH
```

To understand what this is doing:
1. `-m` option: run library module as a script. See official docs https://docs.python.org/3.6/using/cmdline.html and https://docs.python.org/3.6/tutorial/modules.html if you're looking for a deeper understanding
2. `--db_url`: is the option name for the database URL. We read this in using the `argparse` module in `pipeline_runner.py`.
3. `$SBA_DWH`: the environment variable for our database URL. This assumes you've set the database URL as an environment variable. If you have trouble doing this, or if you need to know our database credentials, please ping the #datasci-sba slack channel.

## Open Issues

The external API calls should be removed from the pipeline_runner
flow, as they have limits on the number of calls they can
support. Mike will remove this when the batch control scripts are
completed.
