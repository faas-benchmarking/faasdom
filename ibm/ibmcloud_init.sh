#!/bin/bash

# TODO: Donwload program

tar -xvzf IBM_Cloud_CLI_0.15.1_amd64.tar.gz
rm IBM_Cloud_CLI_0.15.1_amd64.tar.gz
cd Bluemix_CLI/
./install
cd ..
rm -rf Bluemix_CLI/

ibmcloud plugin install cloud-functions

ibmcloud login

ibmcloud account org-create <YOUR_ORGANIZATION>

ibmcloud cf create-space <YOUR_SPACE> -o <YOUR_ORGANIZATION>

ibmcloud target -o <YOUR_ORGANIZATION> -s <YOUR_SPACE>

ibmcloud fn action invoke /whisk.system/utils/echo -p message hello --result