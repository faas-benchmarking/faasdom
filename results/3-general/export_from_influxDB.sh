#!/bin/bash

# Export the general results from the InfluxDB, TODO: edit TESTNAME to your given test name
# If not the factors test is used please replace with corresponding test (after from statement), [latency, factors, matrix, filesystem, custom]
#
# ms: latency in ms
# measures_ms: execution time measured inside function in ms
# provider: cloud provider
# language: runtime / programming language
# memory: memory in MB
# region: region
#
# Unfortunately "name" and "time" cannot be omitted and it can also be not ordered by anything except time

influx -database 'results' -execute "select ms, measured_ms, provider, language, memory, region from factors where test = 'TESTNAME'" -format 'csv' > raw_DB_export.csv
