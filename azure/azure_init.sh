#!/bin/sh
# see https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli

sudo apt-get install apt-transport-https lsb-release software-properties-common dirmngr -y

wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb

sudo dpkg -i packages-microsoft-prod.deb

sudo add-apt-repository universe

sudo apt-get update

sudo apt-get install dotnet-sdk-2.2 -y

echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ bionic main" | sudo tee /etc/apt/sources.list.d/azure-cli.list

sudo apt-get update

sudo apt-get install azure-cli

az login

sudo npm install -g azure-functions-core-tools