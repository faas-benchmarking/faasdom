// IMPORTANT: for python need to run (Azure CLI needs to use python 3.6):
// sudo apt-get install python3-venv -y
// python3.6 -m venv .env
// source .env/bin/activate

const latencyModule = require("./latency.js");
const fs = require('fs');
const exec = require('child_process').exec;
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
const MEMORY = 'memory';

const providers = [AWS, AZURE, GOOGLE, IBM];
const languages = [NODE, PYTHON, GO, DOTNET];
const tests = [LATENCY, FACTORS, MEMORY];

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
	if(req.query.latency == 'true') {
		deploy(req.query, LATENCY, 'Latency', 'Latency');
	} else if(req.query.factors == 'true') {
		deploy(req.query, FACTORS, 'Factors', 'CPU');
	} else if(req.query.memory == 'true') {
		deploy(req.query, MEMORY, 'Memory', 'Memory');
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
	console.log('App listening on port 3001!')
});

/** load configurations from file */
function loadConfig() {
	config_file = fs.readFileSync("./config.json");
	config = JSON.parse(config_file);
}

/** Executes a shell command and return it as a Promise. */
function execShellCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
	  		if (error) {
				reject();
	  		}		
	  		resolve(stdout? stdout : stderr);
	 	});
	});
}

/** Generalized deploy function*/
async function deploy(params, func, funcFirstUpperCase, testName) {
	currentLogStatus += '<h4>Deploying ' + testName + ' Test...</h4>';

	if(params.aws == 'true') {
		currentLogStatus += '<h5>Amazon Web Services</h5>';
		if(params.node == 'true') {
			await deployFunction(AWS, NODE, func, 'node_' + func, 'node_' + func, 'node_' + func, 'nodejs8.10', 'index.handler', '/aws/src/node/node_' + func + '/', 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(AWS, PYTHON, func, 'python_' + func, 'python_' + func, 'python_' + func, 'python3.6', 'function.my_handler', '/aws/src/python/python_' + func + '/', 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(AWS, GO, func, 'go_' + func, 'go_' + func, 'go_' + func, 'go1.x', func, '/aws/src/go/go_' + func + '/', 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			await deployFunction(AWS, DOTNET, func, 'dotnet_' + func, 'dotnet_' + func, 'dotnet_' + func, 'dotnetcore2.1', funcFirstUpperCase + '::' + funcFirstUpperCase + '.' + funcFirstUpperCase + 'Handler::HandleFunction', '/aws/src/dotnet/' + funcFirstUpperCase + '/', '.NET', '', '');
		}
	}
	if(params.azure == 'true') {
		currentLogStatus += '<h5>Microsoft Azure</h5>';
		if(params.node == 'true') {
			await deployFunction(AZURE, NODE, func, 'node-' + func, '', '', 'node', '', '/azure/src/node/node_' + func, 'Node.js', '', '');
		}
		if(params.python == 'true') {
			// TODO: Only on Linux OS
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Python runtime</li>'
			//await deployFunction(AZURE, PYTHON, func, 'python-' + func, '', '', 'python', '', '/azure/src/python/python_' + func, 'Python', '', '');
		}
		if(params.go == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No Go runtime</li>';
		}
		if(params.dotnet == 'true') {
			await deployFunction(AZURE, DOTNET, func, 'dotnet-' + func, '', '', 'dotnet', '', '/azure/src/dotnet/dotnet_' + func, '.NET', '', '');
		}

	}
	if(params.google == 'true') {
		currentLogStatus += '<h5>Google Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(GOOGLE, NODE, func, 'node_' + func, '', '', 'nodejs8', '', '/google/src/node/' + func, 'Node.js', '', '');
		}
		if(params.python == 'true') {
			await deployFunction(GOOGLE, PYTHON, func, 'python_' + func, '', '', 'python37', '', '/google/src/python/' + func, 'Python', '', '');
		}
		if(params.go == 'true') {
			await deployFunction(GOOGLE, GO, func, 'Go_' + func, '', '', 'go111', '', '/google/src/go/' + func, 'Go', '', '');
		}
		if(params.dotnet == 'true') {
			currentLogStatus += '<li><span style="color:orange">SKIP:</span> No .NET runtime</li>';
		}

	}
	if(params.ibm == 'true') {
		currentLogStatus += '<h5>IBM Cloud</h5>';
		if(params.node == 'true') {
			await deployFunction(IBM, NODE, func, 'node_' + func, 'node_' + func, '', 'nodejs:10', '', '/ibm/src/node/' + func + '/', 'Node.js', ' ', 'json');
		}
		if(params.python == 'true') {
			await deployFunction(IBM, PYTHON, func, 'python_' + func, 'python_' + func, '', 'python:3.7', '', '/ibm/src/python/' + func + '/main.py', 'Python', ' ', 'json');
		}
		if(params.go == 'true') {
			await deployFunction(IBM, GO, func, 'go_' + func, 'go_' + func, '', 'go:1.11', '', '/ibm/src/go/' + func + '/' + func + '.go', 'Go', ' ', 'json');
		}
		if(params.dotnet == 'true') {
			await deployFunction(IBM, DOTNET, func, 'dotnet_' + func, 'dotnet_' + func, '', 'dotnet:2.2', '', '/ibm/src/dotnet/' + funcFirstUpperCase + '/', '.NET', ' --main ' + funcFirstUpperCase + '::' + funcFirstUpperCase + '.' + funcFirstUpperCase + 'Dotnet::Main', 'json')
		}
	}

	currentLogStatus += '<h4>' + testName + ' Test deployed</h4>';
	runningStatus = false;
}

/** Deploy a function */
async function deployFunction(provider, language, test, functionName, APIName, APIPath, runtime, handler, srcPath, languageName, mainMethod, responseType, callback) {
	if(providers.includes(provider) && language.includes(language)) {

		let url = '';
		let error = false;
		
		let dockerMountPoint = '/app';

		if(provider == AWS) {

			let dockerPrefix = 'docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli ';

			if(language == NODE) {

				/** Run npm install */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' node npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath).catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == PYTHON) {

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == GO) {

				/** Build go */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " golang /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; go clean; go get github.com/aws/aws-lambda-go/lambda github.com/aws/aws-lambda-go/events; go build *.go'").catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip * --exclude \"*.go\"'").catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == DOTNET) {

				/** Build and zip function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk /bin/sh -c \'apt-get update; apt-get install zip -y; cd ' + dockerMountPoint + srcPath + '; dotnet build; dotnet tool install -g Amazon.Lambda.Tools; dotnet lambda package -C Release -o ' + functionName + '.zip -f netcoreapp2.1\'').catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			}

			/** Create lambda function */
			await execShellCommand('docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli aws lambda create-function --function-name ' + functionName + ' --runtime ' + runtime + ' --role ' + config.aws.arn_role + ' --memory-size ' + config.global.memory + ' --handler ' + handler + ' --zip-file ' + srcPath + ' --region ' + config.aws.region + ' --timeout ' + config.global.timeout).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating lambda function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			
			/** get the ARN of lambda */
			let lambdaarn = await execShellCommand(dockerPrefix + 'aws lambda list-functions --query "Functions[?FunctionName==\\`' + functionName + '\\`].FunctionArn" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while getting the ARN of the lambda function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			lambdaarn = lambdaarn.replace('\n', '');

			/** Create Api */
			await execShellCommand(dockerPrefix + 'aws apigateway create-rest-api --name "' + APIName + '" --description "Api for ' + functionName + '" --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating REST API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** get the ID of the API */
			let apiid = await execShellCommand(dockerPrefix + 'aws apigateway get-rest-apis --query "items[?name==\\`' + APIName + '\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while getting the REST API ID. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			apiid = apiid.replace('\n', '');

			/** get the parent ID of the API */
			let parentresourceid = await execShellCommand(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while getting the parent ID of the API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			parentresourceid = parentresourceid.replace('\n', '');
			
			/** Create resource on API */
			await execShellCommand(dockerPrefix + 'aws apigateway create-resource --rest-api-id ' + apiid + ' --parent-id ' + parentresourceid + ' --path-part ' + APIPath + ' --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating resource on API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** get the resource ID */
			let resourceid = await execShellCommand(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/' + APIPath + '\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while getting the resource ID of the API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			resourceid = resourceid.replace('\n', '');

			/** Create Method on resource */
			await execShellCommand(dockerPrefix + 'aws apigateway put-method --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --authorization-type NONE --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating resource on API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Link API to lambda function */
			await execShellCommand(dockerPrefix + 'aws apigateway put-integration --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:' + config.aws.region + ':lambda:path/2015-03-31/functions/' + lambdaarn + '/invocations --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while linking API to lambda. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create deployment */
			await execShellCommand(dockerPrefix + 'aws apigateway create-deployment --rest-api-id ' + apiid + ' --stage-name test --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating deployment. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			let apiarn = lambdaarn.replace('lambda', 'execute-api');
			apiarn = apiarn.replace('function:' + functionName, apiid);
			
			/** Give lambda API permission */
			await execShellCommand(dockerPrefix + 'aws lambda add-permission --function-name ' + functionName + ' --statement-id ' + functionName + ' --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "' + apiarn + '/*/*/' + APIPath + '" --region ' + config.aws.region).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while giving lambda the API permission. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			url = 'https://' + apiid + '.execute-api.' + config.aws.region + '.amazonaws.com/test/' + APIPath;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
        } 
        
		else if(provider == AZURE) {

			let dockerPrefix = 'docker run --rm -v azure-secrets:/root/.azure -v serverless-data:' + dockerMountPoint + ' microsoft/azure-cli ';

			let rnd = Math.floor(Math.random()*(999-100+1)+100);
			let resourcegroupname = functionName + '-rg';
			let storagename = functionName.replace(/\-/g, '') + 'storage';

			/** Create a resource group */
			await execShellCommand(dockerPrefix + 'az group create --location westeurope --name ' + resourcegroupname).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating resource group. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create a storage account */
			await execShellCommand(dockerPrefix + 'az storage account create --name ' + storagename + ' --resource-group ' + resourcegroupname + ' --sku Standard_LRS').catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating storage account. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create a function app */
			await execShellCommand(dockerPrefix + 'az functionapp create --resource-group ' + resourcegroupname + ' --consumption-plan-location ' + config.azure.region + ' --name ' + functionName + rnd + ' --storage-account ' + storagename + ' --runtime ' + runtime + ' --os-type Windows').catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while creating function app. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			// old one, with azure-functions-core-tools
			//await execShellCommand('cd ' + srcPath + ' && func azure functionapp publish ' + functionName + rnd + ' && cd ../../../../main');

			/** Deploy a function */
			await execShellCommand(dockerPrefix + 'az functionapp deployment source config-zip -g ' + resourcegroupname + ' -n ' + functionName + rnd + ' --src ' + dockerMountPoint + srcPath + '/' + functionName + '.zip').catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			url = 'https://' + functionName + rnd + '.azurewebsites.net/api/' + test;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}

		else if(provider == GOOGLE) {

			let dockerPrefix = 'docker run --rm -v google-secrets:/root/.config/gcloud -v serverless-data:' + dockerMountPoint + ' google/cloud-sdk ';

			/** Deploy function */
			await execShellCommand(dockerPrefix + 'gcloud functions deploy ' + functionName + ' --region=' + config.google.region + ' --memory=' + config.global.memory + config.google.memory_appendix + ' --timeout=' + config.global.timeout + config.google.timeout_appendix + ' --runtime=' + runtime + ' --trigger-http --source=' + dockerMountPoint + srcPath).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			url = 'https://' + config.google.region + '-' + config.google.project + '.cloudfunctions.net/' + functionName;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}
		
		else if(provider == IBM) {

			let dockerPrefix = 'docker run --rm -v ibm-secrets:/root/.bluemix -v serverless-data:' + dockerMountPoint + ' ibmcom/ibm-cloud-developer-tools-amd64 ';

			if(language == NODE) {

				/** Run npm install */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' node npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath).catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/ubuntu-with-zip /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = srcPath + functionName + '.zip';
			} else if(language == DOTNET) {

				/** Build function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk dotnet publish ' + dockerMountPoint + srcPath + ' -c Release -o ' + dockerMountPoint + srcPath + 'out').catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zipping function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' bschitter/ubuntu-with-zip zip -r -0 -j ' + dockerMountPoint + srcPath + functionName + '.zip ' + dockerMountPoint + srcPath + 'out').catch((err) => {
					error = true;
					console.error(err);
					currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = srcPath + functionName + '.zip';
			}

			/** Create Action */
			await execShellCommand(dockerPrefix + 'ibmcloud fn action create ' + functionName + ' ' + dockerMountPoint + srcPath + mainMethod + ' --kind ' + runtime + ' --memory ' + config.global.memory + ' --timeout ' +  config.global.timeout + '000 --web true').catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create API */
			await execShellCommand(dockerPrefix + 'ibmcloud fn api create /' + APIName + ' get ' + functionName + ' --response-type ' + responseType).catch((err) => {
				error = true;
				console.error(err);
				currentLogStatus += '<li><span style="color:red">ERROR:</span> Error happened while deploying API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			url = 'https://eu-de.functions.cloud.ibm.com/api/v1/web/' + config.ibm.organization + '_' + config.ibm.space + '/default/' + APIName + '.' + responseType;
			currentLogStatus += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function</li>';
		}


		if(test == LATENCY) {
			latencyModule.pushURL(provider, language, url);
			console.log(url);
		} else if(test == FACTORS) {
			// TODO: similar to latency urls
			console.log(url);
		} else {
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
		await execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws lambda delete-function --function-name ' + allFunctions.awsFunctions[i])
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function "' + allFunctions.awsFunctions[i] + '" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function "' + allFunctions.awsFunctions[i] + '" could not be deleted</li>';
		});
	}
	for(let i = 0; i<allFunctions.awsGateways.length; i++) {
		if(i>0) {
			await new Promise(resolve => setTimeout(resolve, 30000));
		}
		await execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws apigateway delete-rest-api --rest-api-id ' + allFunctions.awsGateways[i])
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> API with ID "' + allFunctions.awsGateways[i] + '" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> API with ID "' + allFunctions.awsGateways[i] + '" could not be deleted</li>';
		});
	}

	currentLogStatus += '<h5>Microsoft Azure</h5>';
	if(allFunctions.azureResourceGroups.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.azureResourceGroups.length; i++) {
		await execShellCommand('docker run --rm -v azure-secrets:/root/.azure microsoft/azure-cli az group delete --name ' + allFunctions.azureResourceGroups[i] + ' --yes')
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function App in RG "' + allFunctions.azureResourceGroups[i] + '" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function App in RG "' + allFunctions.azureResourceGroups[i] + '" could not be deleted</li>';
		});
	}

	currentLogStatus += '<h5>Google Cloud</h5>';
	if(allFunctions.googleFunctions.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.googleFunctions.length; i++) {
		await execShellCommand('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk gcloud functions delete ' + allFunctions.googleFunctions[i] + ' --region ' + config.google.region + ' --quiet')
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> Function "' + allFunctions.googleFunctions[i] + '" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Function "' + allFunctions.googleFunctions[i] + '" could not be deleted</li>';
		});
	}

	currentLogStatus += '<h5>IBM Cloud</h5>';
	if(allFunctions.ibmFunctions.length == 0 && allFunctions.ibmGateways.length == 0) {
		currentLogStatus += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
	}
	for(let i = 0; i<allFunctions.ibmGateways.length; i++) {
		await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn api delete / /' + allFunctions.ibmGateways[i])
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" could not b deleted</li>';
		});
	}
	for(let i = 0; i<allFunctions.ibmFunctions.length; i++) {
		await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn action delete ' + allFunctions.ibmFunctions[i])
		.then((stdout) => {
			currentLogStatus += '<li><span style="color:green">INFO:</span> Action "' + allFunctions.ibmFunctions[i] + '" deleted</li>';
		})
		.catch((err) => {
			console.error(err);
			currentLogStatus += '<li><span style="color:red">ERROR:</span> Action "' + allFunctions.ibmFunctions[i] + '" could not be deleted</li>';
		});
	}

	currentLogStatus += '<h4>Cleanup finished</h4>';
	runningStatus = false;

}

/** Loads all deployed functions on all cloud, used by cleanup process */
async function loadDeployedFunctions() {

	let awsFunctions = [], awsGateways = [], googleFunctions = [], azureResourceGroups = [], ibmFunctions = [], ibmGateways = [];

	await execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws lambda list-functions')
	.then((stdout) => {
		let awslambda = JSON.parse(stdout);
		for(let i = 0; i<awslambda.Functions.length; i++) {
			awsFunctions.push(awslambda.Functions[i].FunctionName);
		}
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing AWS lambda functions</li>';
	});


	await execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli aws apigateway get-rest-apis')
	.then((stdout) => {
		let awsapi = JSON.parse(stdout);
		for(let i = 0; i<awsapi.items.length; i++) {
			awsGateways.push(awsapi.items[i].id);
		}
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing AWS APIs</li>';
	});

	await execShellCommand('docker run --rm -v azure-secrets:/root/.azure microsoft/azure-cli az group list')
	.then((stdout) => {
		let azureresourcegroups = JSON.parse(stdout);
		for(let i = 0; i<azureresourcegroups.length; i++) {
			if(azureresourcegroups[i].name.includes('latency') || azureresourcegroups[i].name.includes('factors') || azureresourcegroups[i].name.includes('memory')) {
				azureResourceGroups.push(azureresourcegroups[i].name);
			}
		}
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing Azure resource groups</li>';
	});


	await execShellCommand('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk gcloud functions list')
	.then((stdout) => {
		let googlefunctions = stdout;
		let array = googlefunctions.split('\n');
		array.pop();
		array.shift();
		for(let i = 0; i<array.length; i++) {
			let row = array[i];
			row = row.replace(/\s+/g, ' ');
			let elements = row.split(' ');
			googleFunctions.push(elements[0]);
		}
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing Google Cloud functions</li>';
	});

	await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn api list')
	.then((stdout) => {
		let ibmapi = stdout;
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
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing IBM Cloud APIs</li>';
	});

	await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64 ibmcloud fn action list')
	.then((stdout) => {
		let ibmactions = stdout;
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
	})
	.catch((err) => {
		console.error(err);
		currentLogStatus += '<li><span style="color:red">ERROR:</span> Could not load existing IBM Cloud actions</li>';
	});


	return {awsFunctions, awsGateways, googleFunctions, azureResourceGroups, ibmFunctions, ibmGateways};
}