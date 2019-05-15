# IBM Cloud Functions

This document shows how to install the [IBM Cloud-CLI](https://cloud.ibm.com/docs/cli).

## On the IBM Cloud Platform

- Register and create an account [https://www.ibm.com/cloud/](https://www.ibm.com/cloud/)
- Upgrade your account (necessary to use functions with CLI)

## Install IBM Cloud-CLI (for Ubuntu/Debian)

see: [https://cloud.ibm.com/docs/cli?topic=cloud-cli-install-devtools-manually#install-devtools-manually](https://cloud.ibm.com/docs/cli?topic=cloud-cli-install-devtools-manually#install-devtools-manually)
script: [ibmcloud_init.sh](ibmcloud_init.sh)

#### Install IBM Cloud-CLI
Download your version from https://cloud.ibm.com/docs/cli?topic=cloud-cli-install-ibmcloud-cli&locale=de#install-ibmcloud-cli

```
tar -xvzf IBM_Cloud_CLI_0.15.1_amd64.tar.gz
rm IBM_Cloud_CLI_0.15.1_amd64.tar.gz
cd Bluemix_CLI/
./install
```

#### Install Cloud Functions-Plugin
`ibmcloud plugin install cloud-functions`

#### Login to the IBM Cloud-CLI
`ibmcloud login`

 - Enter your email
 - Enter your password
 - Choose your location

#### Create an organization
`ibmcloud account org-create functionOrg`

#### Create a space
`ibmcloud cf create-space functionSpace -o functionOrg`

Hint: Creates a space but sometime cannot add the manager, recommended to do on the platform in the browser.

#### Set default organization and space
`ibmcloud target -o functionOrg -s functionSpace`

Save them to the file [config.json](../main/config.json) into the object `ibm`, `organization` resp `space`.

#### Test Setup
`ibmcloud fn action invoke /whisk.system/utils/echo -p message hello --result`