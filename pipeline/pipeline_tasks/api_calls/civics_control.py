"""
Control functions for Google Civics external API
"""
import os



def check_credentials():
    # Check that all required envars are set.
    try:
        if os.environ['GOOGLEAPI'] is None:
            print("No GOOGLEAPI")
            return False
    except:
        print("No GOOGLEAPI")
        return False
    return True


def get_params(max_records, older_than):
    params = { 'max_records': 25000, 'max_days_to_store': 21 }
    if max_records > 0:
        params["max_records"] = min(params["max_records"], max_records)
    if older_than > 0:
        params["max_days_to_store"] = min(params["max_days_to_store"], older_than)
    return params


def get_record_ids(params):
    max_records = params["max_records"]
    max_days_to_store = params["max_days_to_store"]
    print("Return up to {} records that have not been updated in at least {} days.".format(max_records, max_days_to_store))
    # TODO - connect to the DB, needs the credentials
    records = []
    for i in range(1, max_records + 1):
        records.append(i)
    return records


def process_ids(records):
    # TODO - call the API and update the data set based on the IDs provided.
    print("Enter process_ids for {} records.".format(len(records)))
    return None
