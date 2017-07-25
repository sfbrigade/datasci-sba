# Pipeline Runner
This pipeline runner is a way to keep all tasks hitting our database in a central location. The value of this, is that we can recreate the state of our database very easily, and we what all the tasks that are writing to our database are.

The entry point into the pipeline runner is [pipeline_runner.py](./pipeline_runner.py). In this file, we essentially create a for loop that loops through all the files in a list and executes them. Currently we only support `.sql` and `.py` files.

## Adding Additional Files
To add additional files to run, simply add the file name to the `files` list object.

To run the pipeline, you need to have the connection string stored as an environment variable. You will also need to have Python3 installed as well as necessary dependencies specified in `requirements.txt`. Please see the [development environment onboarding doc](https://github.com/sfbrigade/datasci-sba/blob/master/onboarding/02_development_environment.md) for more information.

## Running the Pipeline Runner
To actually run `pipeline_runner.py` you need to first be in the root folder of the repository. `cd` into that. For example
```
cd ~/git/datasci-sba
```

Now to run the `pipeline_runner.py`:
```
python -m pipeline.pipeline_runner --db_url=$SBA_DWH
```

To understand what this is doing:
1. `-m` option: run library module as a script. See official docs https://docs.python.org/3.6/using/cmdline.html and https://docs.python.org/3.6/tutorial/modules.html if you're looking for a deeper understanding
2. `--db_url`: is the option name for the database URL. We read this in using the `argparse` module in `pipeline_runner.py`.
3. `$SBA_DWH`: the environment variable for our database URL. This assumes you've set the database URL as an environment variable. If you have trouble doing this, or if you need to know our database credentials, please ping the #datasci-sba slack channel.
