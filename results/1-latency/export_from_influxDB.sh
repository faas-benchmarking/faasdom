#!/bin/bash

# Export the latency results from the InfluxDB, TODO: edit TESTNAME to your given test name
#
# ms: latency in ms
# provider: cloud provider
# region: region to which the latency test was performed
#
# Unfortunately "name" and "time" cannot be omitted and it can also be not ordered by anything except time

influx -database 'results' -execute "select ms, provider, region from latency where test = 'TESTNAME'" -format 'csv' > raw_DB_export.csv
