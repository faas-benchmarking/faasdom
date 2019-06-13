# benchmark-suite-serverless-computing
Repository used for the master thesis "A Benchmark Suite for Serverless Computing".

## About

**IMPORTANT:** This project is currently in development and not all features are implemented or working. Use with caution!

With this tool written in [Node.js](https://nodejs.org/) you can benchmark **serverless** platforms from the following cloud computing providers:

  - [Amazon Web Services](https://aws.amazon.com/) with its serverless service [AWS Lambda](https://aws.amazon.com/lambda/features/)
  - [Microsoft Azure](https://azure.microsoft.com/) with its serverless service [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
  - [Google Cloud](https://cloud.google.com/) with its serverless service [Google Cloud Functions](https://cloud.google.com/functions/)
  - [IBM Cloud](https://www.ibm.com/cloud/) with its serverless service [IBM Cloud Functions](https://www.ibm.com/cloud/functions)

and in the following programming languages:

  - [Node.js](https://nodejs.org/)
  - [Python](https://www.python.org/)
  - [Go](https://golang.org/)
  - [.NET Core](https://dotnet.microsoft.com/)

The basic idea is that you can deploy and run various tests and see how they perform on each cloud and/or programming language.

### Available tests

  - **Latency test:** measures the latency of a very simple function
  - **CPU test (factors):** calculates the factors of a big number iteratively to benchmark the CPU performance
  - more tests will follow soon...

## Getting started

**Info:** All guides and scripts are targeted for Ubuntu but other operating systems follow a similar process.

### Install:

- docker [https://docs.docker.com/install/](https://docs.docker.com/install/)
- docker-compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

For Ubuntu 18.04 you can do the following:

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt-get update
sudo apt-get install docker-ce docker-compose

# add your user to the docker group if you don't want to run it always with sudo (requires logout and login)
sudo groupadd docker
sudo usermod -aG docker $USER
```

### Configure

For each cloud provider you need to create an account and maybe setup some things:

  - For AWS see: [Amazon Web Services Setup.md](aws/Amazon%20Web%20Services%20Setup.md)
  - For Azure see: [Microsoft Azure Setup.md](azure/Microsoft%20Azure%20Setup.md)
  - For Google see: [Google Cloud Setup.md](google/Google%20Cloud%20Setup.md)
  - For IBM see: [IBM Cloud Setup.md](ibm/IBM%20Cloud%20Setup.md)

You also need to create some docker volumes and login into the cloud CLIs, so they can be used in a docker container.
In this case they will even be used from another docker container (so called docker in docker or DinD).
For this you will need to do the following steps:

```bash
# create 5 volumes, 1 for app data and 4 for each clouds secrets
docker volume create serverless-data
docker volume create aws-secrets
docker volume create google-secrets
docker volume create ibm-secrets
docker volume create azure-secrets

# copy all data into the docker volume (IMPORTANT: run from the root directory!)
docker run -v serverless-data:/data --name helper bschitter/ubuntu-with-zip
docker cp . helper:/data
docker rm helper

# mount the volumes and login with the cloud provider
docker run --rm -tiv aws-secrets:/root/.aws mikesir87/aws-cli aws configure
docker run --rm -tiv azure-secrets:/root/.azure microsoft/azure-cli az login
docker run --rm -tiv google-secrets:/root/.config/gcloud google/cloud-sdk gcloud init
docker run --rm -tiv ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud login

# with ibm you also have to set the region -r, the API endpoint --cf-api, the organization -o and the space -s
docker run --rm -tiv ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud target -r <YOUR_REGION> --cf-api https://api.<YOUR_REGION>.bluemix.net -o <YOUR_ORGANIZATION> -s <YOUR_SPACE>
```

To start the main application (in the folder [main](main/)) run:

```bash
docker-compose pull && docker-compose up -d db grafana app
```


## Troubleshooting

#### Azure

The way Azure functions are deployed it is currently not possible to choose Linux as runtime OS, because it is still in preview.