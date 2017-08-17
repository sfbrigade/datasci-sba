# Spec: Designing API Endpoints

## Goals
1. Create API endpoints that will return the necessary information the front end applications will need.
2. Create sufficient test coverage for the API endpoints.

## Background and Significance
We want to create interesting visualizations and host them on our web server. Defining the API endpoints will allow front end applications to access the information they need to display the visualizations.

There are two primary levels of visualizations, and thus two API endpoints we will need to define initially: Zip level and Business-specific level.

## Definition of Done
1. We have created two API endpoints:
    1. Zip Level: Takes two parameters: region type (zip, congressional district, county) and the District Office ID (e.g. SFDO).
    2. Business Level: Takes one parameter: District Office ID 
2. Front end applications are able to access information through these two API endpoints.
3. We also have sufficient test coverage

## Feature Spec

### Zip Level Analysis: Use Cases
In this section, we describe example use cases that we will support for the Zip Level Analysis.

1. We will have a set of regions (e.g. zips, counties, congressional districts) that the user will input as a parameter to the API.
2. The user will also input as a parameter to the API the District Office ID. For now, we will only support SFDO, but in the future if this scales out, this will be good functionality to leave in.
3. The user will then pick a metric X to filter, and then a metric Y to color the map.

Remaining Questions
1. What are the metrics we currently have for filtering and coloring? What are the ones we need?
2. What data do we want to show in the tooltip?
3. Do we need to build in functionality to search by address? Center by location of the user?

### Business Level Analysis: Use Cases
In this section, we describe example use cases that we will support for the Business Level Analysis.
1. The user will input as a parameter to the API the District Office ID; currently we will only support the SFDO.
2. The user may also filter based on some location.
    1. Zipcodes
    2. Counties
    3. Congressional Districts
    4. The idea here is that the use case is someone meets with a city/government official, and they want to know the different businesses funded by the SBA in a given area. How can we show that in an easy manner?
3. Filter based on some metric that proxies for successful businesses (high yelp ratings, loans paid in full). 

