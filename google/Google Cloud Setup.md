# Google Cloud Functions

This document shows you how to install the [Google Cloud CLI](https://cloud.google.com/sdk/).

## On the Google Cloud Platform

 - Register and create an account [https://cloud.google.com/](https://cloud.google.com/)
 - Create a project (or use the default one), copy your project ID to the file [config.json](../main/config.json) into the object `google`, `project`.
 - Activate Cloud Functions on this project (just go to Cloud Functions)
 - Activate Function API on this project (right afterwards in the functions menu)

## Install Google Cloud SDK (for Ubuntu/Debian)

see: [https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu](https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu)
script: [gcloud_init.sh](gcloud_init.sh)

#### Create environment variable for correct distribution
`export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)"`

#### Add the Cloud SDK distribution URI as a package source
`echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list`

#### Import the Google Cloud Platform public key
`curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -`

#### Update the package list and install the Cloud SDK
`sudo apt-get update && sudo apt-get install google-cloud-sdk -y`

#### Initialize gcloud SDK

`gcloud init`

 - press y to login
 - Login in your browser with your account and password
 - Select project you created before (or standard)

#### Test installation

Once the installation is complete, check if you can run `gcloud functions` which should show an error and list available commands.

If this works, your Google Cloud CLI installation should be ok.
