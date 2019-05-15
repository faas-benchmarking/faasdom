#!/bin/sh
# https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

sudo apt-get install awscli -y

aws --version

aws configure set aws_access_key_id <YOUR_AWS_ACCESS_KEY_ID>

aws configure set aws_secret_access_key <YOUR_AWS_SECRET_ACCESS_KEY>

aws configure set default.region eu-central-1

aws configure set default.output json

aws sts get-caller-identity