"""
Control functions for Geocode external API
"""

def get_params(max_records, older_than):
    params = { 'max_records': 2500, 'max_days_to_store': 30 }
    if max_records > 0:
        params["max_records"] = min(params["max_records"], max_records)
    if older_than > 0:
        params["max_days_to_store"] = min(params["max_days_to_store"], older_than)
    return params


def get_record_ids(params):
    records = []
    return records
