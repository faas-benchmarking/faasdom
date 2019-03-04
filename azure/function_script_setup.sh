#!/bin/sh

# INFO: This script requires some sudo commands
# INFO: This script should work on Ubuntu 18.04 and Linux Mint 19.x

# load variable from config file
. "./azure_config"

# Colors
NC="\033[0m"
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"


echo "  #---------------------------------------#"
echo "  | Installing Requirements for Azure CLI |"
echo "  #---------------------------------------#"

# Azure CLI

sudo apt-get install apt-transport-https lsb-release software-properties-common dirmngr -y 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Requirements installed."
else
    echo "    [${RED}ERROR${NC}] Could not install requirements for Azure CLI"
    exit 0
fi

echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ bionic main" | sudo tee /etc/apt/sources.list.d/azure-cli.list 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Added Azure CLI to sources.list"
else
    echo "    [${RED}ERROR${NC}] Could not install requirements for Azure CLI"
    exit 0
fi

sudo apt-get update 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Updated apt..."
else
    echo "    [${RED}ERROR${NC}] Could not install requirements for Azure CLI"
    exit 0
fi

sudo apt-get install azure-cli 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Azure CLI installed"
else
    echo "    [${RED}ERROR${NC}] Could not install requirements for Azure CLI"
    exit 0
fi

echo "  #---------------------------------------#"
echo "  |         Login with Azure CLI          |"
echo "  #---------------------------------------#"

# Azure CLI config

az login -u $ACCOUNT -p $PASSWORD 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Azure CLI logged in with account ${YELLOW}$ACCOUNT${NC}"
else
    echo "    [${RED}ERROR${NC}] Could not login with Azure CLI"
    exit 0
fi

echo "  #---------------------------------------#"
echo "  |        Install NPM and NodeJS         |"
echo "  #---------------------------------------#"

# npm and Node.js

sudo apt-get install npm nodejs 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] NPM and NodeJS installed"
else
    echo "    [${RED}ERROR${NC}] Could not install NPM and NodeJS"
    exit 0
fi

echo "  #---------------------------------------#"
echo "  |  Install Azure Function Tools (node)  |"
echo "  #---------------------------------------#"

# Azure function node tools

npm list -g azure-functions-core-tools 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] azure-functions-core-tools already installed."
else
    if [ $? -eq 0 ]; then
        echo "    [${GREEN}OK${NC}] azure-functions-core-tools installed"
    else
        echo "    [${RED}ERROR${NC}] Could not install azure-functions-core-tools"
        exit 0
    fi
fi

# resource group

echo "  #---------------------------------------#"
echo "  |      Create Azure Resource Group      |"
echo "  #---------------------------------------#"

az group create --name $RESOURCEGROUPNAME --location $LOCATION 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Azure resource group ${YELLOW}$RESOURCEGROUPNAME${NC} created."
else
    echo "    [${RED}ERROR${NC}] Could not create azure resource group."
    exit 0
fi

# storage account

echo "  #---------------------------------------#"
echo "  |     Create Azure Storage Account      |"
echo "  #---------------------------------------#"

az storage account create --name $STORAGENAME --location $LOCATION --resource-group $RESOURCEGROUPNAME --sku Standard_LRS 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Azure storage account ${YELLOW}$STORAGENAME${NC} created."
else
    echo "    [${RED}ERROR${NC}] Could not create azure storage account."
    exit 0
fi

# function app

echo "  #---------------------------------------#"
echo "  |       Create Azure Function App       |"
echo "  #---------------------------------------#"

az functionapp create --resource-group $RESOURCEGROUPNAME --consumption-plan-location $LOCATION --name $FUNCTIONNAME --storage-account $STORAGENAME --runtime $LANGUAGE 2>&1 >/dev/null

if [ $? -eq 0 ]; then
    echo "    [${GREEN}OK${NC}] Azure function app ${YELLOW}$FUNCTIONNAME${NC} created."
else
    echo "    [${RED}ERROR${NC}] Could not create azure function app."
    exit 0
fi

# TODO: second part, create function and deploy...