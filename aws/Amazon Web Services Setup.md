# AWS Lambda

This document shows you how to install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).

## On the Amazon Web Services Platform

  - Register and create an account [https://aws.amazon.com/](https://aws.amazon.com/)
  - Under *Security, Identity & Compliance* go to *IAM* then to *Roles*
  - Select *Create role*, then select *Lambda* and click on *Next: Permissions*.
  - Select the rights *AWSLambdaBasicExecutionRole* and *AmazonAPIGatewayAdministrator* and click on *Next: Tags*.
  - Skip this step, click on *Next: Review*.
  - Enter a name for the role, e.g. **lambda-cli-role** and click *Create Role*.
  - Click on the created role. There you can see the ARN. Copy it and save it to the file [config.json](../main/config.json) into the object `aws`, `arn_role`.
  - Under *IAM*, *Users* select you user and then *Security Credentials*
  - Click on *Create access key* and note down the *Access key ID* and the *Secret access key*, you need them later for login with the CLI

## Install AWS CLI (for Ubuntu/Debian)

see: [https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html](https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html)
script: [function_script_setup.sh](function_script_setup.sh)

#### Install the AWS CLI
`sudo apt-get install awscli -y`

#### Check the installation of the AWS CLI
`aws --version`

#### Set access key
`aws configure set aws_access_key_id <YOUR_AWS_ACCESS_KEY_ID>`

#### Set secret access key
`aws configure set aws_secret_access_key <YOUR_AWS_SECRET_ACCESS_KEY>`

#### Set default region
`aws configure set default.region eu-central-1`

#### Set default output
`aws configure set default.output json`

#### Test installation

Once the installation is complete, check if you can run `aws lambda create-function` which should show an error and list of missing parameters.

If this works, yourAWS CLI installation should be ok.