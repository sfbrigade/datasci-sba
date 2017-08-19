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
county is not in a single district.

### Storing the data

My instinct is to create a congressional district table: id (auto
gen), state, district number (by convention 0 is used for at large
states like WY).

Then lookup each address from some source, determine the Congressional
district, find our id and insert this id into the table
stg_analytics.sba_sfdo.
