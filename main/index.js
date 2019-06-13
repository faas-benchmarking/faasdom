// IMPORTANT: for python need to run (Azure CLI needs to use python 3.6):
// sudo apt-get install python3-venv -y
// python3.6 -m venv .env
// source .env/bin/activate

const latencyModule = require("./latency.js");
const fs = require('fs');
const execAwait = require('await-exec')
const { exec } = require('child-process-promise');
const express = require('express');
const app = express();

/** constants with providers and languages */
const AWS = 'aws';
const AZURE = 'azure';
const GOOGLE = 'google';
const IBM = 'ibm';

const NODE = 'node';
const PYTHON = 'python';
const GO = 'go';
const DOTNET = 'dotnet';

const LATENCY = 'latency';
const FACTORS = 'factors';

const providers = [AWS, AZURE, GOOGLE, IBM];
const languages = [NODE, PYTHON, GO, DOTNET];
const tests = [LATENCY, FACTORS];

/** variable for config data */
var config;

var currentLogStatus = '';
var runningStatus = false;
var latencyRunningInterval;
var latencyPrintingInterval;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res, next) {
	res.render('index', {data: ''});
});

app.get('/deploy', async function(req, res, next) {
	runningStatus = true;
	currentLogStatus = '';
	// TODO: make generic
	if(req.query.latency == 'true') {
		deployLatency(req.query);
	} else if(req.query.factors == 'true') {
		deployFactors(req.query);
	} else {
		console.log('invalid test');
	}
	res.send({data: currentLogStatus, running: runningStatus});
});

//TODO: make generic for all tests --> rename to run
app.get('/run', function(req, res, next) {
	runningStatus = true;
	currentLogStatus = '';
	latencyRunningInterval = setInterval(function(){latencyModule.getLatency()}, 5000);
	latencyPrintingInterval = setInterval(function(){currentLogStatus = latencyModule.printResults()}, 5000);
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/stop', function(req, res, next) {
	runningStatus = false;
	currentLogStatus = '';
	clearInterval(latencyRunningInterval);
	clearInterval(latencyPrintingInterval);
	res.send({data: currentLogStatus, running: runningStatus});
});


app.get('/cleanup', function(req, res, next) {
	runningStatus = true;
	currentLogStatus = '';
	cleanup();
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/status', function(req, res, next) {
	res.send({data: currentLogStatus, running: runningStatus});
});

loadConfig();
app.listen(3001, function () {
	console.log('Example app listening on port 3001!')
});

/** load configurations from file */
function loadConfig() {
	config_file = fs.readFileSync("./config.json");
	config = JSON.parse(config_file);
}

/** Deploy function for latency*/
async function deployLatency(params) {
	currentLogStatus += '<h4>Deploying Latency Test...</h4>';

	if(params.aws == 'true') {
		currentLogStatus += '<h5>Amazon Web Services</h5>';
		if(params.node == 'true') {
			await deployFunction(AWS, NODE, LATENCY, 'node_latency', 'node_latency', 'node_latency', 'nodejs8.10', 'index.handler', '/aws/src/node/node_latency/', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(AWS, PYTHON, LATENCY, 'python_latency', 'python_latency', 'python_latency', 'python3.6', 'function.my_handler', '/aws/src/python/python_latency/', 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(AWS, GO, LATENCY, 'go_latency', 'go_latency', 'go_latency', 'go1.x', 'latency', '/aws/src/go/go_latency/', 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			await deployFunction(AWS, DOTNET, LATENCY, 'dotnet_latency', 'dotnet_latency', 'dotnet_latency', 'dotnetcore2.1', 'Latency::Latency.LatencyHandler::HandleFunction', '/aws/src/dotnet/Latency/', '.NET', '', '');
		}
	}
	if(params.azure == 'true') {
		currentLogStatus += '<h5>Microsoft Azure</h5>';
		if(params.node == 'true') {
			await deployFunction(AZURE, NODE, LATENCY, 'node-latency', '', '', 'node', '', '/azure/src/node/node_latency', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			// TODO: Only on Linux OS
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Python runtime</li>'
			//await deployFunction(AZURE, PYTHON, LATENCY, 'python-latency', '', '', 'python', '', '/azure/src/python/python_latency', 'Python', '', '');
		}
		if(params.go == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Go runtime</li>';
		}
		if(params.dotnet == 'true') {
			await deployFunction(AZURE, DOTNET, LATENCY, 'dotnet-latency', '', '', 'dotnet', '', '/azure/src/dotnet/dotnet_latency', '.NET', '', '');
		}

	}
	if(params.google == 'true') {
		currentLogStatus += '<h5>Google Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(GOOGLE, NODE, LATENCY, 'node_latency', '', '', 'nodejs8', '', '/google/src/node/latency', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(GOOGLE, PYTHON, LATENCY, 'python_latency', '', '', 'python37', '', '/google/src/python/latency', 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(GOOGLE, GO, LATENCY, 'Go_latency', '', '', 'go111', '', '/google/src/go/latency', 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No .NET runtime</li>';
		}

	}
	if(params.ibm == 'true') {
		currentLogStatus += '<h5>IBM Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(IBM, NODE, LATENCY, 'node_latency', 'node_latency', '', 'nodejs:10', '', '/ibm/src/node/latency/', 'Node.js', ' ', 'json');
		}
		if(params.python == 'true') {
			await deployFunction(IBM, PYTHON, LATENCY, 'python_latency', 'python_latency', '', 'python:3.7', '', '/ibm/src/python/latency/main.py', 'Python', ' ', 'json');
		}
		if(params.go == 'true') {
			await deployFunction(IBM, GO, LATENCY, 'go_latency', 'go_latency', '', 'go:1.11', '', '/ibm/src/go/latency/latency.go', 'Go', ' ', 'json');
		}
		if(params.dotnet == 'true') {
			await deployFunction(IBM, DOTNET, LATENCY, 'dotnet_latency', 'dotnet_latency', '', 'dotnet:2.2', '', '/ibm/src/dotnet/Latency/', '.NET', ' --main Latency::Latency.LatencyDotnet::Main', 'json')
		}
	}

	currentLogStatus += '<h4>Latency Test deployed</h4>';
	runningStatus = false;
}

/** Deploy function factors */
async function deployFactors(params) {
	currentLogStatus += '<h4>Deploying CPU Test (Factors)...</h4>';

	if(params.aws == 'true') {
		currentLogStatus += '<h5>Amazon Web Services</h5>';
		if(params.node == 'true') {
			await deployFunction(AWS, NODE, FACTORS, 'node_factors', 'node_factors', 'node_factors', 'nodejs8.10', 'index.handler', '/aws/src/node/node_factors/', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(AWS, PYTHON, FACTORS, 'python_factors', 'python_factors', 'python_factors', 'python3.6', 'function.my_handler', '/aws/src/python/python_factors/', 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(AWS, GO, FACTORS, 'go_factors', 'go_factors', 'go_factors', 'go1.x', 'factors', '/aws/src/go/go_factors/', 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			await deployFunction(AWS, DOTNET, FACTORS, 'dotnet_factors', 'dotnet_factors', 'dotnet_factors', 'dotnetcore2.1', 'Factors::Factors.FactorsHandler::HandleFunction', '/aws/src/dotnet/Factors/', '.NET', '', '');
		}
	}
	if(params.azure == 'true') {
		currentLogStatus += '<h5>Microsoft Azure</h5>';
		if(params.node == 'true') {
			await deployFunction(AZURE, NODE, FACTORS, 'node-factors', '', '', 'node', '', '/azure/src/node/node_factors', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			// TODO: Only on Linux OS
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Python runtime</li>';
			//await deployFunction(AZURE, PYTHON, FACTORS, 'python-factors', '', '', 'python', '', '/azure/src/python/python_factors', 'Python', '', '');
		}
		if(params.go == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Go runtime</li>';
		}
		if(params.dotnet == 'true') {
			await deployFunction(AZURE, DOTNET, FACTORS, 'dotnet-factors', '', '', 'dotnet', '', '/azure/src/dotnet/dotnet_factors', '.NET', '', '');
		}
	}
	if(params.google == 'true') {
		currentLogStatus += '<h5>Google Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(GOOGLE, NODE, FACTORS, 'node_factors', '', '', 'nodejs8', '', '/google/src/node/factors', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(GOOGLE, PYTHON, FACTORS, 'python_factors', '', '', 'python37', '', '/google/src/python/factors', 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(GOOGLE, GO, FACTORS, 'Go_factors', '', '', 'go111', '', '/google/src/go/factors', 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No .NET runtime</li>';
		}
	}
	if(params.ibm == 'true') {
		currentLogStatus += '<h5>IBM Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(IBM, NODE, FACTORS, 'node_factors', 'node_factors', '', 'nodejs:10', '', '/ibm/src/node/factors/', 'Node.js', ' ', 'json');
		}
		if(params.python == 'true') {
			await deployFunction(IBM, PYTHON, FACTORS, 'python_factors', 'python_factors', '', 'python:3.7', '', '/ibm/src/python/factors/main.py', 'Python', ' ', 'json');
		}
		if(params.go == 'true') {
			await deployFunction(IBM, GO, FACTORS, 'go_factors', 'go_factors', '', 'go:1.11', '', '/ibm/src/go/factors/factors.go', 'Go', ' ', 'json');
		}
		if(params.dotnet == 'true') {
			await deployFunction(IBM, DOTNET, FACTORS, 'dotnet_factors', 'dotnet_factors', '', 'dotnet:2.2', '', '/ibm/src/dotnet/Factors/', '.NET', ' --main Factors::Factors.FactorsDotnet::Main', 'json');
		}
	}

	currentLogStatus += '<h4>CPU Test (factors) deployed</h4>';
	runningStatus = false;

}

/** Deploy a function */
async function deployFunction(provider, language, test, functionName, APIName, APIPath, runtime, handler, srcPath, languageName, mainMethod, responseType) {
	if(providers.includes(provider) && language.includes(language)) {

		let url = '';
		
		let dockerMountPoint = '/app';

		if(provider == AWS) {

			let dockerPrefix = 'docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli ';

			if(language == NODE) {
				await execAwait('docker run --rm -v serverless-data:' + dockerMountPoint + ' node npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath);
				await execAwait("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'");
				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == PYTHON) {
				await execAwait("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'");
				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == GO) {
				await execAwait("docker run --rm -v serverless-data:" + dockerMountPoint + " golang /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; go clean; go get github.com/aws/aws-lambda-go/lambda github.com/aws/aws-lambda-go/events; go build *.go'");
				await execAwait("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip * --exclude \"*.go\"'")
				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == DOTNET) {
				await execAwait('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk /bin/sh -c \'apt-get update; apt-get install zip -y; cd ' + dockerMountPoint + srcPath + '; dotnet build; dotnet tool install -g Amazon.Lambda.Tools; dotnet lambda package -C Release -o ' + functionName + '.zip -f netcoreapp2.1\'');
				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			}

			await execAwait('docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli aws lambda create-function --function-name ' + functionName + ' --runtime ' + runtime + ' --role ' + config.aws.arn_role + ' --memory-size ' + config.global.memory + ' --handler ' + handler + ' --zip-file ' + srcPath + ' --region ' + config.aws.region + ' --timeout ' + config.global.timeout);
			let lambdaarn = await exec(dockerPrefix + 'aws lambda list-functions --query "Functions[?FunctionName==\\`' + functionName + '\\`].FunctionArn" --output text --region ' + config.aws.region);
			lambdaarn = lambdaarn.stdout.replace('\n', '');
			await execAwait(dockerPrefix + 'aws apigateway create-rest-api --name "' + APIName + '" --description "Api for ' + functionName + '" --region ' + config.aws.region);
			let apiid = await exec(dockerPrefix + 'aws apigateway get-rest-apis --query "items[?name==\\`' + APIName + '\\`].id" --output text --region ' + config.aws.region);
			apiid = apiid.stdout.replace('\n', '');
			let parentresourceid = await exec(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/\\`].id" --output text --region ' + config.aws.region);
			parentresourceid = parentresourceid.stdout.replace('\n', '');
			await execAwait(dockerPrefix + 'aws apigateway create-resource --rest-api-id ' + apiid + ' --parent-id ' + parentresourceid + ' --path-part ' + APIPath + ' --region ' + config.aws.region);
			let resourceid = await exec(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/' + APIPath + '\\`].id" --output text --region ' + config.aws.region);
			resourceid = resourceid.stdout.replace('\n', '');
			await exec(dockerPrefix + 'aws apigateway put-method --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --authorization-type NONE --region ' + config.aws.region);
			await exec(dockerPrefix + 'aws apigateway put-integration --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:' + config.aws.region + ':lambda:path/2015-03-31/functions/' + lambdaarn + '/invocations --region ' + config.aws.region);
			await execAwait(dockerPrefix + 'aws apigateway create-deployment --rest-api-id ' + apiid + ' --stage-name test --region ' + config.aws.region);
			let apiarn = lambdaarn.replace('lambda', 'execute-api');
			apiarn = apiarn.replace('function:' + functionName, apiid);
			await execAwait(dockerPrefix + 'aws lambda add-permission --function-name ' + functionName + ' --statement-id ' + functionName + ' --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "' + apiarn + '/*/*/' + APIPath + '" --region ' + config.aws.region);
			url = 'https://' + apiid + '.execute-api.' + config.aws.region + '.amazonaws.com/test/' + APIPath;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
        } 
        
		else if(provider == AZURE) {

			let dockerPrefix = 'docker run --rm -v azure-secrets:/root/.azure -v serverless-data:' + dockerMountPoint + ' microsoft/azure-cli ';

			let rnd = Math.floor(Math.random()*(999-100+1)+100);
			let resourcegroupname = functionName + '-rg';
			let storagename = functionName.replace(/\-/g, '') + 'storage';
			await execAwait(dockerPrefix + 'az group create --location westeurope --name ' + resourcegroupname).catch(r => {console.error('ERROR!!!')});
			await execAwait(dockerPrefix + 'az storage account create --name ' + storagename + ' --resource-group ' + resourcegroupname + ' --sku Standard_LRS');
			await execAwait(dockerPrefix + 'az functionapp create --resource-group ' + resourcegroupname + ' --consumption-plan-location ' + config.azure.region + ' --name ' + functionName + rnd + ' --storage-account ' + storagename + ' --runtime ' + runtime + ' --os-type Windows');
			// old one, with azure-functions-core-tools
			//await execAwait('cd ' + srcPath + ' && func azure functionapp publish ' + functionName + rnd + ' && cd ../../../../main');
			await execAwait(dockerPrefix + 'az functionapp deployment source config-zip -g ' + resourcegroupname + ' -n ' + functionName + rnd + ' --src ' + dockerMountPoint + srcPath + '/' + functionName + '.zip');
			url = 'https://' + functionName + rnd + '.azurewebsites.net/api/' + test;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}

		else if(provider == GOOGLE) {

			let dockerPrefix = 'docker run --rm -v google-secrets:/root/.config/gcloud -v serverless-data:' + dockerMountPoint + ' google/cloud-sdk ';

			await execAwait(dockerPrefix + 'gcloud functions deploy ' + functionName + ' --region=' + config.google.region + ' --memory=' + config.global.memory + config.google.memory_appendix + ' --timeout=' + config.global.timeout + config.google.timeout_appendix + ' --runtime=' + runtime + ' --trigger-http --source=' + dockerMountPoint + srcPath);
			url = 'https://' + config.google.region + '-' + config.google.project + '.cloudfunctions.net/' + functionName;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}
		
		else if(provider == IBM) {

			let dockerPrefix = 'docker run --rm -v ibm-secrets:/root/.bluemix -v serverless-data:' + dockerMountPoint + ' ibmcom/ibm-cloud-developer-tools-amd64 ';

			if(language == NODE) {
				await execAwait('docker run --rm -v serverless-data:' + dockerMountPoint + ' node npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath);
				await execAwait("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'");
				srcPath = srcPath + functionName + '.zip';
			} else if(language == DOTNET) {
				await execAwait('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk dotnet publish ' + dockerMountPoint + srcPath + ' -c Release -o ' + dockerMountPoint + srcPath + 'out');
				await execAwait('docker run --rm -v serverless-data:' + dockerMountPoint + ' bschitter/ubuntu-with-zip zip -r -0 -j ' + dockerMountPoint + srcPath + functionName + '.zip ' + dockerMountPoint + srcPath + 'out');
				srcPath = srcPath + functionName + '.zip';
			}

			await execAwait(dockerPrefix + 'ibmcloud fn action create ' + functionName + ' ' + dockerMountPoint + srcPath + mainMethod + ' --kind ' + runtime + ' --memory ' + config.global.memory + ' --timeout ' +  config.global.timeout + '000 --web true');
			await execAwait(dockerPrefix + 'ibmcloud fn api create /' + APIName + ' get ' + functionName + ' --response-type ' + responseType);
			url = 'https://eu-de.functions.cloud.ibm.com/api/v1/web/' + config.ibm.organization + '_' + config.ibm.space + '/default/' + APIName + '.' + responseType;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}


		if(test == LATENCY) {
			latencyModule.pushURL(provider, language, url);
			console.log(url);
		} else if(test == FACTORS) {
			// TODO: similar to latency urls
			console.log(url);
		}

	}
}

/** Cleans up (deletes) all functions and gateways on each cloud */
async function cleanup() {

	currentLogStatus += '<h4>Cleaning Up...</h4>';

	let allFunctions = await loadDeployedFunctions();
	latencyModule.resetURLs();

	currentLogStatus += '<h5>Amazon Web Services</h5>';
	if(allFunctions.awsFunctions.length == 0 && allFunctions.awsGateways.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.awsFunctions.length; i++) {
		try {
			await execAwait('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws lambda delete-function --function-name ' + allFunctions.awsFunctions[i]);
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function "' + allFunctions.awsFunctions[i] + '" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function "' + allFunctions.awsFunctions[i] + '" could not be deleted</li>';
		}
	}
	for(let i = 0; i<allFunctions.awsGateways.length; i++) {
		if(i>0) {
			await new Promise(resolve => setTimeout(resolve, 30000));
		}
		try {
			await execAwait('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws apigateway delete-rest-api --rest-api-id ' + allFunctions.awsGateways[i]);
			currentLogStatus += '<li><span style="color:green">INFO:</span> API with ID "' + allFunctions.awsGateways[i] + '" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> API with ID "' + allFunctions.awsGateways[i] + '" could not be deleted</li>';
		}
	}

	currentLogStatus += '<h5>Microsoft Azure</h5>';
	if(allFunctions.azureResourceGroups.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.azureResourceGroups.length; i++) {
		try {
			await execAwait('docker run --rm -v azure-secrets:/root/.azure microsoft/azure-cli az group delete --name ' + allFunctions.azureResourceGroups[i] + ' --yes');
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function App in RG "' + allFunctions.azureResourceGroups[i] + '" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function App in RG "' + allFunctions.azureResourceGroups[i] + '" could not be deleted</li>';
		}
	}

	currentLogStatus += '<h5>Google Cloud</h5>';
	if(allFunctions.googleFunctions.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.googleFunctions.length; i++) {
		try {
			await execAwait('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk gcloud functions delete ' + allFunctions.googleFunctions[i] + ' --region ' + config.google.region + ' --quiet');
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function "' + allFunctions.googleFunctions[i] + '" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function "' + allFunctions.googleFunctions[i] + '" could not be deleted</li>';
		}
	}

	currentLogStatus += '<h5>IBM Cloud</h5>';
	if(allFunctions.ibmFunctions.length == 0 && allFunctions.ibmGateways.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.ibmGateways.length; i++) {
		try {
			await execAwait('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn api delete / /' + allFunctions.ibmGateways[i]);
			currentLogStatus += '<li><span style="color:green">INFO:</span> Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" could not b deleted</li>';
		}
	}
	for(let i = 0; i<allFunctions.ibmFunctions.length; i++) {
		try {
			await execAwait('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn action delete ' + allFunctions.ibmFunctions[i]);
			currentLogStatus += '<li><span style="color:green">INFO:</span> Action "' + allFunctions.ibmFunctions[i] + '" deleted</li>';
		} catch(err) {
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Action "' + allFunctions.ibmFunctions[i] + '" could not be deleted</li>';
		}
	}

	currentLogStatus += '<h4>Cleanup finished</h4>';
	runningStatus = false;

}

/** Loads all deployed functions on all cloud, used by cleanup process */
async function loadDeployedFunctions() {

	let awsFunctions = [], awsGateways = [], googleFunctions = [], azureResourceGroups = [], ibmFunctions = [], ibmGateways = [];

	let awslambda = await exec('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws lambda list-functions');
  	awslambda = JSON.parse(awslambda.stdout);
	for(let i = 0; i<awslambda.Functions.length; i++) {
		awsFunctions.push(awslambda.Functions[i].FunctionName);
	}
	let awsapi = await exec('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws apigateway get-rest-apis');
	awsapi = JSON.parse(awsapi.stdout);
	for(let i = 0; i<awsapi.items.length; i++) {
		awsGateways.push(awsapi.items[i].id);
	}

	let azureresourcegroups = await exec('docker run --rm -v azure-secrets:/root/.azure microsoft/azure-cli az group list');
	azureresourcegroups = JSON.parse(azureresourcegroups.stdout);
	for(let i = 0; i<azureresourcegroups.length; i++) {
		if(azureresourcegroups[i].name.includes('latency') || azureresourcegroups[i].name.includes('factors')) {
			azureResourceGroups.push(azureresourcegroups[i].name);
		}
	}

	let googlefunctions = await exec('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk gcloud functions list');
	googlefunctions = googlefunctions.stdout;
	let array = googlefunctions.split('\n');
	array.pop();
	array.shift();
	for(let i = 0; i<array.length; i++) {
		let row = array[i];
		row = row.replace(/\s+/g, ' ');
		let elements = row.split(' ');
		googleFunctions.push(elements[0]);
	}

	let ibmapi = await exec('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn api list');
	ibmapi = ibmapi.stdout;
	let array2 = ibmapi.split('\n');
	array2.pop();
	array2.shift();
	array2.shift();
	for(let i = 0; i<array2.length; i++) {
		let row = array2[i];
		row = row.replace(/\s+/g, ' ');
		let elements = row.split(' ');
		let parts = elements[3].split('/');
		ibmFunctions.push(parts[parts.length-1])
	}
	let ibmactions = await exec('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn action list');
	ibmactions = ibmactions.stdout;
	let array3 = ibmactions.split('\n');
	array3.pop();
	array3.shift();
	for(let i = 0; i<array3.length; i++) {
		let row = array3[i];
		row = row.replace(/\s+/g, ' ');
		let elements = row.split(' ');
		let parts = elements[0].split('/');
		ibmGateways.push(parts[2])
	}

	return {awsFunctions, awsGateways, googleFunctions, azureResourceGroups, ibmFunctions, ibmGateways};
}