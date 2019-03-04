# Azure Functions

This document shows you how to install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) and how to create a resource group, a storage account and then the function app which we actually want. It has been tested and used on Linux Mint 19.1 64-Bit, but should also work on other Ubuntu 18.04 based distributions.

There is a shell script you can use instead of doing this manually, see [function_script_setup.sh](function_script_setup.sh)

This information has been taken from [https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli)

## Prerequisites

Some necessary packages:

```shell
sudo apt-get install apt-transport-https lsb-release software-properties-common dirmngr -y
```

.NET SDK (e.g. for blob storage triggers needed, see [https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current)):

```shell
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install dotnet-sdk-2.2
```

## Azure CLI

Install the Azure CLI:

```shell
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ bionic main" | sudo tee /etc/apt/sources.list.d/azure-cli.list
sudo apt-get update
sudo apt-get install azure-cli
```

Login with the Azure CLI

```shell
az login -u <USERNAME> -p <PASSWORD>
```

## npm and Node.js

Install npm and Node.js:

```shell
sudo apt-get install npm nodejs
```

and then install Azure Functions node modules:

```shell
sudo npm install -g azure-functions-core-tools
```

## Create a resource group

```shell
az group create --name <NAME_OF_RESOURCE_GROUP> --location <LOCATION>
```

## Create an Azure storage account

```shell
az storage account create --name <NAME_OF_STORAGE> --location <LOCATION> --resource-group <NAME_OF_RESOURCE_GROUP> --sku Standard_LRS
```

## Create an Azure function app

```shell
az functionapp create --resource-group <NAME_OF_RESOURCE_GROUP> --consumption-plan-location <LOCATION> --name <APP_NAME> --storage-account <NAME_OF_STORAGE> --runtime <LANGUAGE>
```

## Create a function project locally

```shell
func init <APP_NAME> --worker-runtime <RUNTIME> --language <LANGUAGE>
```

and switch to the directoy:

```shell
cd <APP_NAME>
```

## Create a function
```shell
func new --name <FUNCTION_NAME> --template <TRIGGER>
```

## Start the function locally

```shell
func start
```

## Deploy the function

```shell
func azure functionapp publish <APP_NAME>
```

### Hints
 - Set the `authLevel` in `functions.json` to `Anonymous` if you want to disable API key authentication
