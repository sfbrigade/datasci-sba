"""Script to batch run external API flows

This script controls all the external API processes. 

An API process may require a special authorization key and may contain
a limit to the number of queries per timeframe. This script allows you
to manage those flows and schedule a cron job to stay within the
limitation.

The script allows multiple flows to run in a single invocation, but
this often makes it harder to diagnose problems. It is generally
suggested to run the API flows independently and manage the updates
through a set of cron scripts. Be careful not to check in those cron
scripts to any public source control like Github as anyone with
internet access could discover your keys.

To add a new flow, create a Python3 module that can be imported as
shown below for yelp_control. Place the script in the
pipeline/pipeline_tasks/api_calls dir.

Each module needs to declare the following methods:

- check_credentials(args), which returns True is all required auth keys
  can be found (keys can be specified with optional arguments or envars).

- get_params(max_records, older_than), which will combine the user
  specified maximum records and older than range with the ranges that
  are permitted by the API. The more restrictive value is returned in
  a dictionary.

- update_records(args, api_params, db_params), which takes the command
  line args, the params from get_params() and the database params and
  does all the work to call the API and save the updates in the
  sba_sfdo_api_calls table. The return value is None if something
  major went wrong, or the number of records updated. 0 could mean a
  minor error occurred or simply that there were no records that
  needed updating given the params.

- reset_timestamps(db_params), which will clear the specific timestamp
  for this API from the sba_sfdo_api_calls table. As a result, the
  script will proess all the records through the API, ordered by the
  index.

- clear_data(db_params), which will clear all the API data from the
  table.

After providing the new Python module, add arguments in get_args()
under the api_selection group and then call your module in the main()
flow below.

"""

import argparse

import datetime as dt

import os

from pipeline.pipeline_tasks.api_calls import yelp_control as yc
from pipeline.pipeline_tasks.api_calls import civics_control as civc
from pipeline.pipeline_tasks.api_calls import geocode_control as geoc


RUNTIME_ID = str(dt.datetime.now())
SQL_PATH = os.path.join(os.path.dirname(__file__), 'pipeline_tasks')

starttime = dt.datetime.now()

"""Define a function that converts string to bool used in argparse"""
def _str2bool(v):
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

""" Use argparse to pare command line arguments."""
def get_args():
    parser = argparse.ArgumentParser(description='Control script to run external API tasks')
    parser.add_argument('--db_url',
                        help='Database url string to the db.',
                        type=str,
                        required=True)
    parser.add_argument('--max_attempts',
                        help='Maximum records to attempt. If not specified, the maximum number of records depends on the external API usage limits.',
                        type=int,
                        required=False,
                        metavar='max_records')
    parser.add_argument('--older_than',
                        help='Process only records older than number of days. If not specified, number of days depends on the external API usage limits.',
                        type=int,
                        required=False,
                        metavar='num_days')
    parser.add_argument('--reset_update_time',
                        type=_str2bool,
                        nargs='?',
                        const=True,
                        default=False,
                        help='Reset the API update time on all records. Operates only on the selected APIs.')
    parser.add_argument('--clear_all_data',
                        type=_str2bool,
                        nargs='?',
                        const=True,
                        default=False,
                        help='Clear the API data on all records. Operates only on the selected APIs.')

    api_selection = parser.add_argument_group('API Selection', 'At least one API Selection is required, but all may be selected. Keys may be required for the API to function.')
    api_selection.add_argument('--yelp',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Yelp API process')
    parser.add_argument('--yelp_id',
                        help='Yelp ID key',
                        type=str,
                        required=False)
    parser.add_argument('--yelp_secret',
                        help='Yelp secret key',
                        type=str,
                        required=False)

    api_selection.add_argument('--civics',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Google Civics API process')
    parser.add_argument('--civics_key',
                        help='Google Civics API key',
                        type=str,
                        required=False)

    api_selection.add_argument('--geocode',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Geocode API process',
                               required=False)
    parser.add_argument('--geocode_key',
                        help='Google Maps API key',
                        type=str,
                        required=False)

    args = parser.parse_args()
    if not (args.civics or args.geocode or args.yelp):
        print("No APIs selected to run.")
        parser.print_help()
        parser.exit(2);
    return args

"""Main function to run tasks."""
def main():
    args = get_args()

    print("Starting API Update")
    clear_all_data = args.clear_all_data
    reset_update_time = False

    """If we are clearing all data, there is no reason to also reset the
    update times since that is a side effect of clearing the data.
    """
    if clear_all_data is False:
        reset_update_time = args.reset_update_time
        
    if args.max_attempts:
        max_records = args.max_attempts
    else:
        max_records = -1
    if args.older_than:
        older_than = args.older_than
    else:
        older_than = -1

    do_yelp = False
    if args.yelp:
        if yc.check_credentials(args) is False:
            print("Warning: Yelp credentials not set, cannot process.")
        else:
            do_yelp = True

    do_civics = False
    if args.civics:
        if civc.check_credentials(args) is False:
            print("Warning: Google Civics credentials not set, cannot process.")
        else:
            do_civics = True

    do_geocode = False
    if args.geocode:
        if geoc.check_credentials(args) is False:
            print("Warning: Geocode credentials not set, cannot process.")
        else:
            do_geocode = True
            
    db_params = { 'db_url' : args.db_url }
    if do_yelp:
        print("...Processing Yelp")
        if clear_all_data:
            yc.clear_data(db_params)
        elif reset_update_time:
            yc.reset_timestamp(db_params)
        yelp_params = yc.get_params(max_records, older_than)
        yelp_updated = yc.update_records(args, yelp_params, db_params)
        if yelp_updated is None :
            print("Warning: Unable to complete requested Yelp update.")
        elif yelp_updated is 0:
            print("Warning: No Yelp records updated this run.")
        else:
            print("...Updated Yelp information on {} records (attempted {}).".format(yelp_updated, yelp_params['max_records']))
                
    if do_civics:
        print("...Updating Google Civics")
        if clear_all_data:
            civc.clear_data(db_params)
        elif reset_update_time:
            civc.reset_timestamp(db_params)
        civics_params = civc.get_params(max_records, older_than)
        civics_updated = civc.update_records(args, civics_params, db_params)
        if civics_updated is None:
            print("Warning: Unable to complete rerquested Google Civics update.")
        elif civics_updated is 0:
            print("Warning: No Civics records updated this run.")
        else:
            print("...Updated Google Civics information on {} records (attempted {}).".format(civics_updated, civics_params['max_records']))

    if do_geocode:
        print("...Updating Google Geocode")
        if clear_all_data:
            geoc.clear_data(db_params)
        elif reset_update_time:
            geoc.reset_timestamp(db_params)
        geocode_params = geoc.get_params(max_records, older_than)
        geocode_updated = geoc.update_records(args, geocode_params, db_params)
        if geocode_updated is None:
            print("Warning: Unable to complete requested Google Geocode update.")
        elif geocode_updated is 0:
            print("Warning: No Google Geocode records update this run.")
        else:
            print("...Updated Google Geocode information on {} records (attempted {}).".format(geocode_updated, geocode_params['max_records']))

    print("Complete")

if __name__ == '__main__':
    main()

