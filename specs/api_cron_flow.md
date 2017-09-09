# Automating the API Update Flow with Cron

## Problem Statement

Some of the extern APIs that we use may not allow us to process all of
our data records in a single batch. If we exceed some request limit in
a short time, our access may be throttled or suspended.

## Background and Significance


There are currently two APIs that we use to enhance the data sets from
the SBA.

The first is an API to get the Yelp rating where possible.

The second is a Google Civics API to get the Congressional district
based on the borrower address.

Given the size of our database (even just for the SFDO loan set), if
we try to update all the ratings in a single run, the API providers
may throttle our access.

The request is to be able to chunk the output into small batches and
schedule a cron job to update on a cycle until all records have been
attempted.

## Final Result

For this project, we will make changes to the script to allow it to
run a specific set of records and then exit. We will provide the
capability to keep track of which records have been attempted and
which have not. We will also provide an example of a cron scheduling
job that would permite the entire database to be refreshed over a
period of hours or days.

## Proposed Approach

### Updates to the API control script

The API control script will need a new argument which indicates the
maximum number of calls it should make to each API it supports. This
could be named something like '--max_attempts'. I suggest another
argument to force it to restart with the first record, something like
'--reset_last_attempt'.

When the API control script is done, it should update the cache or
database table to indicate the last record it has processed. We should
store the sba_sfdo_id value since these are unique and easily
processed.

The API control script will need to lookup from a cache or simple
database table the last successful record processed. It should skip
any records <= to the last processed key.

If --max_attempts is specified, then once the script has updated that
number of records, it should update the last processed key and exit.

Storing the last processed record in the cache may be overkill. It
could be stored on the user's hard drive and overwritten when the
script completes another iteration. It depends on whether we want
several computers to churn through records on the same copy of the
data or not.

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

This article has a good
[https://www.pantz.org/software/cron/croninfo.html](cron explanation).

