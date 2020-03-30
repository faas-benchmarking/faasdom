#!/bin/bash
touch tmp
grep aws raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep aws raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep aws raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep aws raw_coldstart_all_data.csv 	| grep NET	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
nl tmp > data/aws.txt

rm tmp
touch tmp
grep azure raw_coldstart_all_data.csv 	| grep Node.js | grep -v "azure_win" 	| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep Node.js | grep "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'}  | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep NET	 | grep -v "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep azure raw_coldstart_all_data.csv 	| grep NET	 | grep    "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
nl tmp > data/azure.txt

rm tmp
touch tmp
grep google raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep google raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep google raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
nl tmp > data/google.txt

rm tmp
touch tmp
grep ibm raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep ibm raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep ibm raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep ibm raw_coldstart_all_data.csv 	| grep NET	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
nl tmp > data/ibm.txt

##now all together
rm tmp
touch tmp
grep aws raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep aws raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep aws raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep aws raw_coldstart_all_data.csv 	| grep NET	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep azure raw_coldstart_all_data.csv 	| grep Node.js | grep -v "azure_win" 	| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep Node.js | grep "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'}  | ./calc_percentiles.rb  >> tmp
grep azure raw_coldstart_all_data.csv 	| grep NET	 | grep -v "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep azure raw_coldstart_all_data.csv 	| grep NET	 | grep    "azure_win" 		| awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep google raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep google raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep google raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep ibm raw_coldstart_all_data.csv 	| grep Node.js | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep ibm raw_coldstart_all_data.csv 	| grep Python  | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp
grep ibm raw_coldstart_all_data.csv 	| grep Go	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
grep ibm raw_coldstart_all_data.csv 	| grep NET	   | awk -F ',' {'print $2'} | ./calc_percentiles.rb  >> tmp 
nl tmp > data/combined.txt
rm tmp