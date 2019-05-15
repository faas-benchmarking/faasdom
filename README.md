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

The basic idea is that you setup accounts and CLIs (command line interfaces) for the above mentioned cloud providers. Afterwards you can deploy and run various tests and see how they perform on each cloud and/or programming language.

### Available tests

  - **Latency test:** measures the latency of a very simple function
  - **CPU test (factors):** calculates the factors of a big number iteratively to benchmark the CPU performance
  - more tests will follow soon...

## Getting started

**Info:** All guides and scripts are targeted for Ubuntu but other operating systems follow a similar process.

First of all you have to install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

`sudo apt-get install nodejs npm`

Then for each cloud provider you need to setup their CLI and maybe other packages:

  - For AWS see: [Amazon Web Services Setup.md](aws/Amazon%20Web%20Services%20Setup.md)
  - For Azure see: [Microsoft Azure Setup.md](azure/Microsoft Azure Setup.md)
  - For Google see: [Google Cloud Setup.md](google/Google Cloud Setup.md)
  - For IBM see: [IBM Cloud Setup.md](ibm/IBM Cloud Setup.md)

To start the main application (in the folder [main](main/)) first install the required node packages with

`npm install`

and then

`node .`

to start it.

## Troubleshooting

#### Cleanup

The cleanup of AWS Api Gateways can fail. This is due to a maximum of 1 deletion of a REST API every 30 seconds. This cannot be changed. See: [https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html)

#### Azure

The first time you deploy an Azure Function it can take a very long time and even fail due to a timeout. Be patient.
Might also be due to an update of the Azure Functions Core Tools.

#### ZIP

If you don't have it already, please install the package `zip`. It is used to zip and package applications.
`sudo apt-get install zip`

#### Python & Azure

The Azure CLI can throw errors if you use the wrong version of python. If that happens, create a virtual environment and launch then the app.
```
python3.6 -m venv .env
source .env/bin/activate
```

#### Go

To use Go and AWS you need to install the `golang` package:
`sudo apt-get install golang`

#### .NET

To build and publish .NET applications (used by AWS, Azure and IBM) you need the .NET SDK. See: [https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/sdk-current)