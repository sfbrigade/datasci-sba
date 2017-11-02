# Third Party API Flow
In this doc, we will explain how the third party API data is maintained and updated.

## List of Third Party Data
The project uses third party data from three sources:
1. Yelp (for business ratings)
2. Google Civics (for US congressional districts)
3. Google Maps (for geocoded latitude and longitude)

## Basics of the Flows
All of the above APIs require a key to authenticate. They also have limitations on the number of hits per day and the length of time we can cache the data. The net result is that we cannot update 48,000+ records in one session, and we cannot keep the data in our database permanently. The API flow mechanism was developed to assist in honoring these limitations by allowing us to batch the updates and reset the data fields.

## Location of the Data
The API data is stored in the `stg_analytics.sba_sfdo_api_calls` table. The `sba_sfdo_id` is the key back to the loan data in `stg_analytics.sba_sfdo`.

## API Control Script
To update the API data, execute `$PYTHONPATH/pipeline/pipeline_api_controller.py`. This script supports a rich set of options, which you can see with the `-h/--help` argument.

## Scheduling a Cron Job
You must create a setup script which can be sourced in bash. The script must define the following envars:
`SBA_DWH` (for connecting to the database)
`GOOGLEAPI` (if using Google Civics)
`GOOGLE_MAPS_API` (if using Geocode/GoogleV3)
`YELP_ID` and `YELP_SECRET` (if using Yelp)
`PYTHONPATH` (the root to your datasci-sba code)

You must ensure that `anaconda3/envs/datasci-sba/bin`, `/anaconda/bin`, `/usr/bin`, `/usr/bin`, `/sbin` and `/usr/local/sbin` are in your PATH var.

You can create a cron entry similar to the following:
`00,30 * * * * source /Users/michaelmathews/datasci-sba_setup.sh && /Users/michaelmathews/Documents/CodeForSF/datasci-sba/pipeline/pipeline_cron.sh --db_url $SBA_DWH --geocode --geocode_key $GOOGLE_MAPS_API --max_attempts 40`

This will run a job on the hour and half hour every hour of every day. The job will attempt to update 40 records in geocode. Note that the `datasci-sba_setup.sh` script runs first to set the required envars. This script must never be placed in Git or it would expose your API keys.

| Previous |
|:---------:|
| [Tips and Tricks](./03_tips_and_tricks.md) |


