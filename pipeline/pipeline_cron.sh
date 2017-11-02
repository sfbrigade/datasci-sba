#!/bin/bash

source activate datasci-sba
cd $PYTHONPATH

/Users/michaelmathews/anaconda3/bin/python3 pipeline/pipeline_api_controller.py "$@"
