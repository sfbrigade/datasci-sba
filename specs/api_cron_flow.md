# Changes and Automation for the API Update Flow

## Problem Statement

Some of the external APIs that we use may not allow us to process all
of our data records in a single batch. If we send too many requests to
the API in a short time, our access may be throttled or suspended. We
need to be able to update the various external APIs in a reasonable
fashion.

## Background and Significance

There are currently three APIs that we use to enhance the data sets
from the SBA.

The first is an API to get the Yelp rating where possible.

The second is a Google Civics API to get the Congressional district
based on the borrower address.

The third is an attempt to obtain the latitude and longitude for the
borrower addresses.

Given the size of our database (even just for the SFDO loan set), if
we try to update all the ratings in a single run, the API providers
may throttle our access. The Google Civics API has a daily limit of
25,000 calls and one of the potential goecode APIs has a 2,500 daily
limit.

The request is to be able to chunk the output into small batches and
schedule a cron job to run repeatedly until all records have been
attempted.

## Final Result

For this project, we will make changes to the script to allow it to
run a specific set of records and then exit. We will provide the
capability to keep track of which records have been attempted and
which have not. We will provide the ability to update the external
APIs separately based on different limitations. We will also provide
an example of a cron scheduling job that would permit the entire
database to be refreshed over a period of hours or days.

## Proposed Approach

### General Discussion of Approach

We discussed an approach whereby a wrapper script is used to setup the
database and Python environment. The script will then pass arguments
down to the control script, which will select records to be processed
by each API. The control script will pass a selection of sba_sfdo_id
fields (or other appropriate key) to the execution script for each API
that is to be run.

This approach means that the API execution script does not need to
worry about processing the arguments or filtering the records.  Other
than updating the timestamp, the execution code has very little
knowledge of the batch control process.

The cron job will call the wrapper script with the appropriate
args. There will be a number of entries in the cron file to properly
process all the external APIs in a timely manner.

### Updates to the API control script

The API control script will support the following new arguments.

At least one of the following must be specified (all three may be
specified if desired):

--yelp: indicates that the script should update the Yelp entries.

--civics: indicates that the script should update the Congressional
  district entries.

--geocode: indicates tha the script should update the Geocode
  entries. Optional, if not specified these records are unchanged.

The following are optional but recomended:

--max_attempts <integer>: indicates the maximum number of records to
  select for updating. The program will select records which have
  never been updated first, and then sort others by last update
  time. If not specified, all records will be selected for update,
  subject to the --older_than value.

--older_than <days>: indicates that only records older than the
  specified number of days will be selected for update. If not
  specified, then records will be selected from oldest to most recent
  subject to the --max_attempts value.

The following is optional:

--reset_update_time: indicates that the last update time is to be
  cleared, which means all records will be attempted in this and
  future executions of the API update process until each has been
  attempted.

When the API control script makes updates, it needs to update a time
stamp field. Since the API updates can be done independently of each
other, each API needs its own "last updated" time stamp.

We do not need to cache any information about last processed, as the
script will filter records based on longest time since last update
(with not yet updated being selected first).

### Cron job

Any Unix/Linux based machine should support running a cron job. The
format allows you great flexibility in approaching your scheduling.

The primary thing to keep in mind is that the jobs will execute in a
very basic shell and will not likely have all of the datasci-sba
python environment. Thus, it may be helpful to create a wrapper script
that establishes the Python environment, sets the API keys and calls
the API control script. This script can't be checked in or it will
expose the API keys.

Also, caution should be used when manipulating the cron file so as not
to overwrite existing cron jobs (if any).

This article has a good [cron explanation](https://www.pantz.org/software/cron/croninfo.html).

