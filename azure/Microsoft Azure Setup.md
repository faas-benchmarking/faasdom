# Microsoft Azure Functions

This document shows you how to install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

## On the Microsoft Azure portal

 - Register and create an account [https://azure.microsoft.com/](https://azure.microsoft.com/)

## Install Azure CLI and other dependencies (for Ubuntu/Debian)

see: [https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli)
script: [azure_init.sh](azure_init.sh)

#### Install Some necessary packages

`sudo apt-get install apt-transport-https lsb-release software-properties-common dirmngr -y`

#### Install the .NET SDK

```
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2
```

#### Install the Azure CLI

```
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ bionic main" | sudo tee /etc/apt/sources.list.d/azure-cli.list
sudo apt-get update
sudo apt-get install azure-cli
```

#### Login with the Azure CLI
`az login`

#### Azure Functions Core Tools
`sudo npm install -g azure-functions-core-tools`

#### Create a resource group and storage account used later by the functions
`az group create --location westeurope --name <YOUR_RESSOURCEGROUP_NAME>`

**INFO:** The location set here does not affect the location for the functions.

Copy the name to the file [config.json](../main/config.json) into the object `azure`, `resourcegroupname`.

`az storage account create --name <YOUR_STORAGE_NAME> --resource-group <YOUR_RESSOURCEGROUP_NAME>`

Copy the name to the file [config.json](../main/config.json) into the object `azure`, `storagename`
