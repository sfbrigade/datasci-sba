"""
Script to batch run external API flows
"""

import argparse

import datetime as dt

import os


RUNTIME_ID = str(dt.datetime.now())
SQL_PATH = os.path.join(os.path.dirname(__file__), 'pipeline_tasks')

starttime = dt.datetime.now()

def _str2bool(v):
    """Define a function that converts string to bool used in argparse"""
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

def get_args():
    """ Use argparse to pare command line arguments. """
    parser = argparse.ArgumentParser(description='Runner for API tasks')
    parser.add_argument('--db_url',
                        help='Database url string to the db.',
                        type=str,
                        required=True)
    parser.add_argument('--max_attempts',
                        help='Maximum records to attempt',
                        type=int,
                        required=False,
                        metavar='max_records')
    parser.add_argument('--older_than',
                        help='Process only records older than number of days',
                        type=int,
                        required=False,
                        metavar='num_days')
    parser.add_argument('--reset_update_time',
                        type=_str2bool,
                        nargs='?',
                        const=True,
                        default=False,
                        help='Reset the API update time on all records')

    api_selection = parser.add_argument_group('API Selection')
    api_selection.add_argument('--yelp',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Yelp API process')
    api_selection.add_argument('--civics',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Google Civics API process')
    api_selection.add_argument('--geocode',
                               type=_str2bool,
                               nargs='?',
                               const=True,
                               default=False,
                               help='Run the Geocode API process',
                               required=False)
    args = parser.parse_args()
    if not (args.civics or args.geocode or args.yelp):
        parser.error("No APIs selected to run.")
    return args

def main():
    """Main function to run tasks."""
    print("Starting")
    args = get_args()
        
    if args.yelp:
        print("Should run Yelp.")
    else:
        print("Should not run Yelp.")
    if args.civics:
        print("Should run Google Civics.")
    else:
        print("Should not run Google Civics.")
    if args.geocode:
        print("Should run Geocode.")
    else:
        print("Should not run Geocode.")
    if args.reset_update_time:
        print("Should reset last update time.")
    else:
        print("Do not reset last update time.")
    max_records = args.max_attempts
    older_than = args.older_than
    print("Should process {} records from those older than {} days.".format(max_records, older_than))


# LOTS STILL TO DO, primarily need to factor out the APIs so they can
# easily be run separately, and also need to make some schema changes
# to have fields to store the last update time stamp for each type of
# API. Then need to provide a way to select the appropriate records to
# run through the given API.

if __name__ == '__main__':
    main()

