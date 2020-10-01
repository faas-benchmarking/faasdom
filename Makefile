.PHONY: all setup create_volumes
all: start

start:
	cd main && docker-compose up -d db grafana app

start_debug:
	cd main && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db grafana app

restart:
	cd main && docker-compose restart db grafana app

clean: stop

stop:
	cd main && docker-compose down

build:
	cd main && docker-compose build

setup: create_volumes copy_data_into_volumne

create_volumes:
	# create 5 volumes, 1 for app data and 4 for each clouds secrets
	docker volume create serverless-data
	docker volume create aws-secrets
	docker volume create google-secrets
	docker volume create ibm-secrets
	docker volume create azure-secrets

copy_data_into_volumne:
	# copy all data into the docker volume (IMPORTANT: run from the project root directory!)
	docker run -v serverless-data:/data --name helper bschitter/alpine-with-zip:0.1
	docker cp . helper:/data
	docker rm helper

login:
	# 1) Follow the config steps in the README under ##configure
	# 2) Use login_CLOUD (CLOUD=aws|azure|google|ibm)

### mount the volumes and login with the cloud provider
login_aws:
	docker run --rm -tiv aws-secrets:/root/.aws mikesir87/aws-cli:1.16.310 aws configure

login_azure:
	docker run --rm -tiv azure-secrets:/root/.azure mcr.microsoft.com/azure-cli:2.0.78 az login

login_google:
	docker run --rm -tiv google-secrets:/root/.config/gcloud google/cloud-sdk:274.0.1-alpine gcloud init

login_ibm:
	docker run --rm -tiv ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.20.0 ibmcloud login
	# NOTE: Need to manually set region, organization, and space
	# with ibm you also have to set the region -r, the API endpoint --cf-api, the organization -o and the space -s
	# docker run --rm -tiv ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.20.0 ibmcloud target -r <YOUR_REGION> --cf-api https://api.<YOUR_REGION>.cf.cloud.ibm.com -o <YOUR_ORGANIZATION> -s <YOUR_SPACE>
