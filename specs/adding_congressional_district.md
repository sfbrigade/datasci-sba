# Adding the Congressional District ID

## Problem Statement

Determine the congressional district for each loan in our database,
based on stg_analytics.sba_sfdo (borr_street, borr_city, borr_state,
borr_zip).

## Background and Significance

We want to support a visualization region by congressional
ID. Unfortunately, congressional IDs can and do cross zip code and
county boundaries (but never state boundaries). We do not have the
congresisonal ID in any of our input data sets.

## Final Result

A new field in the stg_analytics.sba_sfdo table with the congressional
district id.

## Proposed Approach

### Obtaining the data

The best way to obtain the congressional ID is with GEO lat/long
data. Lacking that data, a lookup on the street address can be used if an
appropriate API is available.

Note that many counties or zip codes are only in a single
congressional district, but not all. It might be possible to shortcut
the lookup if a zip is shown to have only a single congressional
district. The full lookup would then only be applied when a zip or
county is not in a single district. Preliminary research indicates a
bit over 50% of zip codes in the SFDO region belong to one
congressional district.

### Storing the data

Create a congressional district table: id (auto gen), state, district
number (by convention 0 is used for at large states like
WY). Congressional district numbers are not unique so both the state
and district number is needed to search. The generated key should be
stored in the analytics table for efficient lookup.

If the address is in a single district county, then we can look up
using the first API below. If not, we need to search by exact address
(not clear yet where I will find this information). If we can geo map
our addresses, then the second API below will work.  Once we determine
the Congressional district, find our id from the table and update the
table stg_analytics.sba_sfdo.

This API looks up the districts by county:
`https://congress.api.sunlightfoundation.com/districts/locate?zip=<zip>`

This API looks up the districts by GeoCode:
`https://congress.api.sunlightfoundation.com/districts/locate?latitude=<lat>&longitude=<long>`

These APIs return data in a string that is trivial to convert to a
dictionary or JSON object in Python.

This Github repository has some information that might help us solve
this
problem. [https://github.com/sunlightlabs/calloncongress](https://github.com/sunlightlabs/calloncongress)

## Future Issues

Since districts get remapped after every census, how shall we handle
these changes? For example, my district changed from CA-8 to CA-12
after the 2010 redistricting.
