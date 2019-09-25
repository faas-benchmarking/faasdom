const latencyModule = require("./latency.js");
const factorsModule = require("./factors.js");
const fs = require('fs');
const exec = require('child_process').exec;
const express = require('express');
const app = express();
const now = require('performance-now');

/** constants with providers and languages */
const AWS = 'aws';
const AZURE = 'azure';
const AZUREWINDOWS = 'azureWindows';
const GOOGLE = 'google';
const IBM = 'ibm';

const NODE = 'node';
const PYTHON = 'python';
const GO = 'go';
const DOTNET = 'dotnet';

const LATENCY = 'latency';
const FACTORS = 'factors';
const MEMORY = 'memory';
const FILESYSTEM = 'filesystem';
const CUSTOM = 'custom';

const providers = [AWS, AZURE, AZUREWINDOWS, GOOGLE, IBM];
const languages = [NODE, PYTHON, GO, DOTNET];
const tests = [LATENCY, FACTORS, MEMORY, CUSTOM];

/** variable for config data */
var config;

var currentLogStatus = '';
var currentLogStatusAWS = '';
var currentLogStatusAWSEnd = '';
var currentLogStatusAzure = '';
var currentLogStatusAzureEnd = '';
var currentLogStatusAzureWindows = '';
var currentLogStatusAzureWindowsEnd = '';
var currentLogStatusGoogle = '';
var currentLogStatusGoogleEnd = '';
var currentLogStatusIBM = '';
var currentLogStatusIBMEnd = '';
var currentLogStatusEnd = '';

var runningStatus = false;
var runningStatusAWS = false;
var runningStatusAzure = false;
var runningStatusAzureWindows = false;
var runningStatusGoogle = false;
var runningStatusIBM = false;

var latencyRunningInterval;
var factorsRunningInterval;
var memoryRunningInterval;
var filesystemRunningInterval;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res, next) {
	res.render('index', {data: ''});
});

app.get('/deploy', async function(req, res, next) {
	runningStatus = true;
	resetLogStatus();
	config.aws.region = req.query.awslocation;
	config.azure.region = req.query.azurelocation;
	config.google.region = req.query.googlelocation;
	config.ibm.region = req.query.ibmlocation;
	if(req.query.latency == 'true') {
		deploy(req.query, LATENCY, 'Latency', 'Latency');
	} else if(req.query.factors == 'true') {
		deploy(req.query, FACTORS, 'Factors', 'CPU');
	} else if(req.query.memory == 'true') {
		deploy(req.query, MEMORY, 'Memory', 'Memory');
	} else if(req.query.filesystem == 'true') {
		deploy(req.query, FILESYSTEM, 'Filesystem', 'Filesystem');
	} else if(req.query.custom == 'true') {
		deploy(req.query, CUSTOM, 'Custom', 'Custom');
	} else {
		console.error('invalid test');
	}
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/run', function(req, res, next) {
	runningStatus = true;
	resetLogStatus();
	currentLogStatus = 'Running...';
	if(req.query.test == LATENCY) {
		latencyRunningInterval = setInterval(function(){latencyModule.getLatency()}, 1000/req.query.rps);
	} else if(req.query.test == FACTORS) {
		factorsRunningInterval = setInterval(function(){factorsModule.getFactors(req.query.n)}, 1000/req.query.rps);
	} else if(req.query.test == MEMORY) {
		// TODO: implement
	} else if(req.query.test == FILESYSTEM) {
		// TODO: implement
	} else {
		console.error('invalid test');
	}
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/stop', function(req, res, next) {
	runningStatus = false;
	resetLogStatus();
	clearInterval(latencyRunningInterval);
	clearInterval(factorsRunningInterval);
	clearInterval(memoryRunningInterval);
	clearInterval(filesystemRunningInterval);
	res.send({data: currentLogStatus, running: runningStatus});
});


app.get('/cleanup', function(req, res, next) {
	runningStatus = true;
	resetLogStatus();
	config.aws.region = req.query.awslocation;
	cleanup();
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/logfile', function(req, res, next) {
	let log = fs.readFileSync("./error.log");
	let html = '<!DOCTYPE html><html><body>';
	html += log.toString();
	html += '</body></html>';
	html = html.replace(/\n/g, '<br>');
	res.send(html);
});

app.get('/cleanupLogFile', function(req, res, next) {
	runningStatus = true;
	resetLogStatus();
	currentLogStatus = '<h4>Deleting Log File...</h4>';
	try {
		fs.writeFileSync('./error.log', '');
		currentLogStatusEnd += '<h4>Log File was cleaned up.</h4>';
		runningStatus = false;
	} catch(err) {
		console.error(err);
		currentLogStatusEnd += '<h4 style="color:red">Log File could not be cleaned up.</h4>';
		runningStatus = false;
	}
	res.send({data: currentLogStatus, running: runningStatus});
});

app.get('/status', function(req, res, next) {
	res.send({
		dataStart: currentLogStatus,
		dataAWS: currentLogStatusAWS + currentLogStatusAWSEnd,
		dataAzure: currentLogStatusAzure + currentLogStatusAzureEnd,
		dataAzureWindows: currentLogStatusAzureWindows + currentLogStatusAzureWindowsEnd,
		dataGoogle: currentLogStatusGoogle + currentLogStatusGoogleEnd,
		dataIBM: currentLogStatusIBM + currentLogStatusIBMEnd,
		dataEnd: currentLogStatusEnd,
		running: runningStatus,
		runningAWS: runningStatusAWS,
		runningAzure: runningStatusAzure,
		runningAzureWindows: runningStatusAzureWindows,
		runningGoogle: runningStatusGoogle,
		runningIBM: runningStatusIBM
	});
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

/** reset all log variables */
function resetLogStatus() {
	currentLogStatus = '';
	currentLogStatusAWS = '';
	currentLogStatusAWSEnd = '';
	currentLogStatusAzure = '';
	currentLogStatusAzureEnd = '';
	currentLogStatusAzureWindows = '';
	currentLogStatusAzureWindowsEnd = '';
	currentLogStatusGoogle = '';
	currentLogStatusGoogleEnd = '';
	currentLogStatusIBM = '';
	currentLogStatusIBMEnd = '';
	currentLogStatusEnd = '';
}

/** Convert milliseconds to minutes and seconds */
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return 'in ' + (minutes == 0 ? '' : (minutes + ' min ')) + seconds + ' sec';
}

/** Executes a shell command and return it as a Promise. */
function execShellCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
	  		if (error) {
				let errorMsg = 'TIME: ' + (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString() + '\n';
				errorMsg += 'ERROR: ' + error;
				errorMsg += 'STDOUT: ' + stdout + (stdout? '' : '\n');
				errorMsg += 'STDERR: ' + stderr + (stderr? '' : '\n');
				errorMsg += '----------------------------------------------------------------------------------------------------\n';
				console.error(errorMsg);
				fs.appendFileSync('./error.log', errorMsg);
				reject();
	  		}		
	  		resolve(stdout? stdout : stderr);
	 	});
	});
}

/** Generalized deploy function*/
async function deploy(params, func, funcFirstUpperCase, testName) {
	currentLogStatus += '<h4>Deploying ' + testName + ' Test...</h4>';

	var promises = [];

	if(params.aws == 'true') {
		let p = deployAWS(params, func, funcFirstUpperCase, testName);
		promises.push(p);
	}
	if(params.azure == 'true') {
		let p = deployAzure(params, func, funcFirstUpperCase, testName);
		promises.push(p);
	}
	if(params.azureWindows == 'true') {
		let p = deployAzureWindows(params, func, funcFirstUpperCase, testName);
		promises.push(p);
	}
	if(params.google == 'true') {
		let p = deployGoogle(params, func, funcFirstUpperCase, testName);
		promises.push(p);
	}
	if(params.ibm == 'true') {
		let p = deployIBM(params, func, funcFirstUpperCase, testName);
		promises.push(p);
	}

	await Promise.all(promises);

	currentLogStatusEnd += '<h4>' + testName + ' Test deployed</h4>';
	runningStatus = false;
}

/** Deploy Function for AWS */
async function deployAWS(params, func, funcFirstUpperCase, testName) {
	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusAWS += '<h5>Amazon Web Services (parallel deployment)</h5>';
		currentLogStatusAWS += '<ul stlye="list-style-position: outside">';
		currentLogStatusAWSEnd += '</ul>';
		runningStatusAWS = true;

		var promises = [];

		if(params.node == 'true') {
			let p = deployFunction(AWS, NODE, func, 'node_' + func, 'node_' + func, 'node_' + func, 'nodejs8.10', 'index.handler', '/aws/src/node/node_' + func + '/', 'Node.js', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.python == 'true') {
			let p = deployFunction(AWS, PYTHON, func, 'python_' + func, 'python_' + func, 'python_' + func, 'python3.6', 'function.my_handler', '/aws/src/python/python_' + func + '/', 'Python', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.go == 'true') {
			let p = deployFunction(AWS, GO, func, 'go_' + func, 'go_' + func, 'go_' + func, 'go1.x', func, '/aws/src/go/go_' + func + '/', 'Go', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.dotnet == 'true') {
			let p = deployFunction(AWS, DOTNET, func, 'dotnet_' + func, 'dotnet_' + func, 'dotnet_' + func, 'dotnetcore2.1', funcFirstUpperCase + '::' + funcFirstUpperCase + '.' + funcFirstUpperCase + 'Handler::HandleFunction', '/aws/src/dotnet/' + funcFirstUpperCase + '/', '.NET', '', '', params.ram, params.timeout);
			promises.push(p);
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusAWS += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusAWS = false;
		resolve();
	});
}

/** Deploy Function for Azure (Linux) */
async function deployAzure(params, func, funcFirstUpperCase, testName) {
	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusAzure += '<h5>Microsoft Azure (Linux, parallel deployment)</h5>';
		currentLogStatusAzure += '<ul stlye="list-style-position: outside">';
		currentLogStatusAzureEnd += '</ul>';
		runningStatusAzure = true;

		var promises = [];

		if(params.node == 'true') {
			let p = deployFunction(AZURE, NODE, func, 'node-' + func, '', '', 'node', '', '/azure/src/node/node_' + func, 'Node.js', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.python == 'true') {
			let p = deployFunction(AZURE, PYTHON, func, 'python-' + func, '', '', 'python', '', '/azure/src/python/python_' + func, 'Python', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.go == 'true') {
			currentLogStatusAzure += '<li><span style="color:orange">SKIP:</span> No Go runtime</li>';
		}
		if(params.dotnet == 'true') {
			let p = deployFunction(AZURE, DOTNET, func, 'dotnet-' + func, '', '', 'dotnet', '', '/azure/src/dotnet/dotnet_' + func, '.NET', '', '', params.ram, params.timeout);
			promises.push(p);
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusAzure += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusAzure = false;
		resolve();
	});
}

/** Deploy Function for Azure (Windows) */
async function deployAzureWindows(params, func, funcFirstUpperCase, testName) {
	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusAzureWindows += '<h5>Microsoft Azure (Windows, parallel deployment)</h5>';
		currentLogStatusAzureWindows += '<ul stlye="list-style-position: outside">';
		currentLogStatusAzureWindowsEnd += '</ul>';
		runningStatusAzureWindows = true;

		var promises = [];

		if(params.node == 'true') {
			let p = deployFunction(AZUREWINDOWS, NODE, func, 'node-' + func, '', '', 'node', '', '/azure/src/node/node_' + func, 'Node.js', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.python == 'true') {
			currentLogStatusAzureWindows += '<li><span style="color:orange">SKIP:</span> No Python runtime</li>';	
		}
		if(params.go == 'true') {
			currentLogStatusAzureWindows += '<li><span style="color:orange">SKIP:</span> No Go runtime</li>';
		}
		if(params.dotnet == 'true') {
			let p = deployFunction(AZUREWINDOWS, DOTNET, func, 'dotnet-' + func, '', '', 'dotnet', '', '/azure/src/dotnet/dotnet_' + func, '.NET', '', '', params.ram, params.timeout);
			promises.push(p);
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusAzureWindows += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusAzureWindows = false;
		resolve();
	});
}

/** Deploy Function for Google */
async function deployGoogle(params, func, funcFirstUpperCase, testName) {
	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusGoogle += '<h5>Google Cloud (parallel deployment)</h5>';
		currentLogStatusGoogle += '<ul stlye="list-style-position: outside">';
		currentLogStatusGoogleEnd += '</ul>';
		runningStatusGoogle = true;

		var promises = [];

		if(params.node == 'true') {
			let p = deployFunction(GOOGLE, NODE, func, 'node_' + func, '', '', 'nodejs8', '', '/google/src/node/' + func, 'Node.js', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.python == 'true') {
			let p = deployFunction(GOOGLE, PYTHON, func, 'python_' + func, '', '', 'python37', '', '/google/src/python/' + func, 'Python', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.go == 'true') {
			let p = deployFunction(GOOGLE, GO, func, 'Go_' + func, '', '', 'go111', '', '/google/src/go/' + func, 'Go', '', '', params.ram, params.timeout);
			promises.push(p);
		}
		if(params.dotnet == 'true') {
			currentLogStatusGoogle += '<li><span style="color:orange">SKIP:</span> No .NET runtime</li>';
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusGoogle += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusGoogle = false;
		resolve();
	});
}

/** Deploy Function for IBM */
async function deployIBM(params, func, funcFirstUpperCase, testName) {
	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusIBM += '<h5>IBM Cloud (sequential deployment)</h5>';
		currentLogStatusIBM += '<ul stlye="list-style-position: outside">';
		currentLogStatusIBMEnd += '</ul>';
		runningStatusIBM = true;

		//var promises = [];

		if(params.node == 'true') {
			await deployFunction(IBM, NODE, func, 'node_' + func, 'node_' + func, '', 'nodejs:10', '', '/ibm/src/node/' + func + '/', 'Node.js', ' ', 'json', params.ram, params.timeout);
			//promises.push(p);
		}
		if(params.python == 'true') {
			await deployFunction(IBM, PYTHON, func, 'python_' + func, 'python_' + func, '', 'python:3.7', '', '/ibm/src/python/' + func + '/main.py', 'Python', ' ', 'json', params.ram, params.timeout);
			//promises.push(p);
		}
		if(params.go == 'true') {
			await deployFunction(IBM, GO, func, 'go_' + func, 'go_' + func, '', 'go:1.11', '', '/ibm/src/go/' + func + '/' + func + '.go', 'Go', ' ', 'json', params.ram, params.timeout);
			//promises.push(p);
		}
		if(params.dotnet == 'true') {
			await deployFunction(IBM, DOTNET, func, 'dotnet_' + func, 'dotnet_' + func, '', 'dotnet:2.2', '', '/ibm/src/dotnet/' + funcFirstUpperCase + '/', '.NET', ' --main ' + funcFirstUpperCase + '::' + funcFirstUpperCase + '.' + funcFirstUpperCase + 'Dotnet::Main', 'json', params.ram, params.timeout)
			//promises.push(p);
		}

		//await Promise.all(promises);

		let end = now();
		currentLogStatusIBM += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusIBM = false;
		resolve();
	});
}

/** Deploy a function */
async function deployFunction(provider, language, test, functionName, APIName, APIPath, runtime, handler, srcPath, languageName, mainMethod, responseType, ram, timeout) {
	if(providers.includes(provider) && language.includes(language)) {

		let url = '';
		let error = false;
		
		let dockerMountPoint = '/app';

		if(provider == AWS) {

			let start = now();

			let dockerPrefix = 'docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli:1.16.216 ';

			if(language == NODE) {

				/** Run npm install */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' node:10.16.2-alpine npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath).catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == PYTHON) {

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == GO) {

				/** Build go */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " golang:1.12-stretch /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; go clean; go get github.com/aws/aws-lambda-go/lambda github.com/aws/aws-lambda-go/events; go build *.go'").catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip * --exclude \"*.go\"'").catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			} else if(language == DOTNET) {

				/** Build and zip function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk:2.1-alpine3.9 /bin/sh -c \'apk -uv add --no-cache zip; cd ' + dockerMountPoint + srcPath + '; dotnet build; dotnet tool install -g Amazon.Lambda.Tools; dotnet lambda package -C Release -o ' + functionName + '.zip -f netcoreapp2.1\'').catch((err) => {
					error = true;
					currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = 'fileb://' + dockerMountPoint + srcPath + functionName + '.zip';
			}

			/** Create lambda function */
			await execShellCommand('docker run --rm -v aws-secrets:/root/.aws -v serverless-data:' + dockerMountPoint + ' mikesir87/aws-cli:1.16.216 aws lambda create-function --function-name ' + functionName + ' --runtime ' + runtime + ' --role ' + config.aws.arn_role + ' --memory-size ' + ram + ' --handler ' + handler + ' --zip-file ' + srcPath + ' --region ' + config.aws.region + ' --timeout ' + timeout).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while creating lambda function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			
			/** get the ARN of lambda */
			let lambdaarn = await execShellCommand(dockerPrefix + 'aws lambda list-functions --query "Functions[?FunctionName==\\`' + functionName + '\\`].FunctionArn" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while getting the ARN of the lambda function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			lambdaarn = lambdaarn.replace('\n', '');

			/** Create Api */
			await execShellCommand(dockerPrefix + 'aws apigateway create-rest-api --name "' + APIName + '" --description "Api for ' + functionName + '" --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while creating REST API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** get the ID of the API */
			let apiid = await execShellCommand(dockerPrefix + 'aws apigateway get-rest-apis --query "items[?name==\\`' + APIName + '\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while getting the REST API ID. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			apiid = apiid.replace('\n', '');

			/** get the parent ID of the API */
			let parentresourceid = await execShellCommand(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while getting the parent ID of the API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			parentresourceid = parentresourceid.replace('\n', '');
			
			/** Create resource on API */
			await execShellCommand(dockerPrefix + 'aws apigateway create-resource --rest-api-id ' + apiid + ' --parent-id ' + parentresourceid + ' --path-part ' + APIPath + ' --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while creating resource on API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** get the resource ID */
			let resourceid = await execShellCommand(dockerPrefix + 'aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/' + APIPath + '\\`].id" --output text --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while getting the resource ID of the API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}
			resourceid = resourceid.replace('\n', '');

			/** Create Method on resource */
			await execShellCommand(dockerPrefix + 'aws apigateway put-method --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --authorization-type NONE --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while creating resource on API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Link API to lambda function */
			await execShellCommand(dockerPrefix + 'aws apigateway put-integration --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:' + config.aws.region + ':lambda:path/2015-03-31/functions/' + lambdaarn + '/invocations --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while linking API to lambda. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create deployment */
			await execShellCommand(dockerPrefix + 'aws apigateway create-deployment --rest-api-id ' + apiid + ' --stage-name test --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while creating deployment. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			let apiarn = lambdaarn.replace('lambda', 'execute-api');
			apiarn = apiarn.replace('function:' + functionName, apiid);
			
			/** Give lambda API permission */
			await execShellCommand(dockerPrefix + 'aws lambda add-permission --function-name ' + functionName + ' --statement-id ' + functionName + ' --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "' + apiarn + '/*/*/' + APIPath + '" --region ' + config.aws.region).catch((err) => {
				error = true;
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Error happened while giving lambda the API permission. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			let end = now();
			let time = millisToMinutesAndSeconds((end-start).toFixed(3));

			url = 'https://' + apiid + '.execute-api.' + config.aws.region + '.amazonaws.com/test/' + APIPath;
			currentLogStatusAWS += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function ' + time;
			currentLogStatusAWS += '<br><a href="' + url + '" target="_blank">' + url + '</a></li>';
        } 
        
		else if(provider == AZURE || provider == AZUREWINDOWS) {

			let start = now();

			let dockerPrefix = 'docker run --rm -v azure-secrets:/root/.azure -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/azure-cli:2.0.71 ';

			let rnd = Math.floor(Math.random()*(999-100+1)+100);
			let resourcegroupname = functionName + '-rg';
			let storagename = functionName.replace(/\-/g, '');
			let functionNamePostfix = '';
			let os = '';
			if(provider == AZURE) {
				resourcegroupname += '-linux';
				storagename += 'linux';
				functionNamePostfix = '-linux-';
				os = 'Linux';
			} else {
				resourcegroupname += '-windows';
				storagename += 'win';
				functionNamePostfix = '-windows-';
				os = 'Windows';
			}

			if(language == NODE) {

				/** Run npm install */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' node:10.16.2-alpine npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath).catch((err) => {
					error = true;
					if(provider == AZURE) {
						currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					} else {
						currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					}
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					if(provider == AZURE) {
						currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					} else {
						currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					}
				});
				if(error) {
					return;
				}

			} else if(language == PYTHON) {

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

			} else if(language == DOTNET) {

				/** Build function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk:2.1-alpine3.9 dotnet publish ' + dockerMountPoint + srcPath + ' -c Release -o ' + dockerMountPoint + srcPath + '/out').catch((err) => {
					error = true;
					if(provider == AZURE) {
						currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					} else {
						currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					}
				});
				if(error) {
					return;
				}

				/** Zipping function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' bschitter/alpine-with-zip:latest /bin/sh -c \'cd ' + dockerMountPoint + srcPath + '/out && zip -r -0 ' + dockerMountPoint + srcPath + '/' + functionName +  '.zip *\'').catch((err) => {
					error = true;
					if(provider == AZURE) {
						currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					} else {
						currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
					}
				});
				if(error) {
					return;
				}

			}

			/** Create a resource group */
			await execShellCommand(dockerPrefix + 'az group create --location ' + config.azure.region + ' --name ' + resourcegroupname).catch((err) => {
				error = true;
				if(provider == AZURE) {
					currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while creating resource group. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				} else {
					currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while creating resource group. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				}
			});
			if(error) {
				return;
			}

			/** Create a storage account */
			await execShellCommand(dockerPrefix + 'az storage account create --name ' + storagename + ' --resource-group ' + resourcegroupname + ' --sku Standard_LRS').catch((err) => {
				error = true;
				if(provider == AZURE) {
					currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while creating storage account. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				} else {
					currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while creating storage account. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				}
			});
			if(error) {
				return;
			}

			/** Create a function app */
			await execShellCommand(dockerPrefix + 'az functionapp create --resource-group ' + resourcegroupname + ' --consumption-plan-location ' + config.azure.region + ' --name ' + functionName + functionNamePostfix + rnd + ' --storage-account ' + storagename + ' --runtime ' + runtime + ' --os-type ' + os).catch((err) => {
				error = true;
				if(provider == AZURE) {
					currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while creating function app. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				} else {
					currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while creating function app. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				}
			});
			if(error) {
				return;
			}

			await new Promise(resolve => setTimeout(resolve, 10000));

			/** Deploy a function */
			await execShellCommand(dockerPrefix + 'az functionapp deployment source config-zip -g ' + resourcegroupname + ' -n ' + functionName + functionNamePostfix + rnd + ' --src ' + dockerMountPoint + srcPath + '/' + functionName + '.zip --timeout ' + timeout).catch((err) => {
				error = true;
				if(provider == AZURE) {
					currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				} else {
					currentLogStatusAzureWindows += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				}
			});
			if(error) {
				return;
			}

			let end = now();
			let time = millisToMinutesAndSeconds((end-start).toFixed(3));

			url = 'https://' + functionName + functionNamePostfix + rnd + '.azurewebsites.net/api/' + test;
			if(provider == AZURE) {
				currentLogStatusAzure += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function ' + time;
				currentLogStatusAzure += '<br><a href="' + url + '" target="_blank">' + url + '</a></li>';
			} else {
				currentLogStatusAzureWindows += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function ' + time;
				currentLogStatusAzureWindows += '<br><a href="' + url + '" target="_blank">' + url + '</a></li>';
			}
		}

		else if(provider == GOOGLE) {

			let start = now();

			let dockerPrefix = 'docker run --rm -v google-secrets:/root/.config/gcloud -v serverless-data:' + dockerMountPoint + ' google/cloud-sdk:257.0.0-alpine ';

			/** Deploy function */
			await execShellCommand(dockerPrefix + 'gcloud functions deploy ' + functionName + ' --region=' + config.google.region + ' --memory=' + ram + config.google.memory_appendix + ' --timeout=' + timeout + config.google.timeout_appendix + ' --runtime=' + runtime + ' --trigger-http --source=' + dockerMountPoint + srcPath).catch((err) => {
				error = true;
				currentLogStatusGoogle += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			let end = now();
			let time = millisToMinutesAndSeconds((end-start).toFixed(3));

			url = 'https://' + config.google.region + '-' + config.google.project + '.cloudfunctions.net/' + functionName;
			currentLogStatusGoogle += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function ' + time;
			currentLogStatusGoogle += '<br><a href="' + url + '" target="_blank">' + url + '</a></li>';
		}
		
		else if(provider == IBM) {

			let start = now();

			let dockerPrefix = 'docker run --rm -v ibm-secrets:/root/.bluemix -v serverless-data:' + dockerMountPoint + ' ibmcom/ibm-cloud-developer-tools-amd64:0.18.0 ';

			if(language == NODE) {

				/** Run npm install */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' node:10.16.2-alpine npm --prefix ' + dockerMountPoint + srcPath + ' install ' + dockerMountPoint + srcPath).catch((err) => {
					error = true;
					currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while running "npm install". Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zip function */
				await execShellCommand("docker run --rm -v serverless-data:" + dockerMountPoint + " bschitter/alpine-with-zip:latest /bin/sh -c 'cd " + dockerMountPoint + srcPath + "; zip -0 -r " + functionName + ".zip *'").catch((err) => {
					error = true;
					currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = srcPath + functionName + '.zip';
			} else if(language == DOTNET) {

				/** Build function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' mcr.microsoft.com/dotnet/core/sdk:2.1-alpine3.9 dotnet publish ' + dockerMountPoint + srcPath + ' -c Release -o ' + dockerMountPoint + srcPath + 'out').catch((err) => {
					error = true;
					currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while building function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				/** Zipping function */
				await execShellCommand('docker run --rm -v serverless-data:' + dockerMountPoint + ' bschitter/alpine-with-zip:latest zip -r -0 -j ' + dockerMountPoint + srcPath + functionName + '.zip ' + dockerMountPoint + srcPath + 'out').catch((err) => {
					error = true;
					currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while zipping function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
				});
				if(error) {
					return;
				}

				srcPath = srcPath + functionName + '.zip';
			}
			/** Set location, organization, space */
			
			await execShellCommand(dockerPrefix + 'ibmcloud target -r ' + config.ibm.region + ' --cf-api https://api.' + config.ibm.region + '.bluemix.net -o ' + config.ibm.organization + ' -s ' + config.ibm.space).catch((err) => {
				error = true;
				currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while deploying API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create Action */
			await execShellCommand(dockerPrefix + 'ibmcloud fn action create ' + functionName + ' ' + dockerMountPoint + srcPath + mainMethod + ' --kind ' + runtime + ' --memory ' + ram + ' --timeout ' +  timeout + '000 --web true').catch((err) => {
				error = true;
				currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while deploying function. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			/** Create API */
			await execShellCommand(dockerPrefix + 'ibmcloud fn api create /' + APIName + ' get ' + functionName + ' --response-type ' + responseType).catch((err) => {
				error = true;
				currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Error happened while deploying API. Function ' + functionName + ' in language ' + languageName + ' was <span style="font-weight: bold">NOT</span> deployed.</li>';
			});
			if(error) {
				return;
			}

			let end = now();
			let time = millisToMinutesAndSeconds((end-start).toFixed(3));

			url = 'https://' + config.ibm.region + '.functions.cloud.ibm.com/api/v1/web/' + config.ibm.organization + '_' + config.ibm.space + '/default/' + APIName + '.' + responseType;
			currentLogStatusIBM += '<li><span style="color:green">INFO:</span> Deployed ' + languageName + ' function ' + time;
			currentLogStatusIBM += '<br><a href="' + url + '" target="_blank">' + url + '</a></li>';
		}

		console.log(url);

		if(test == LATENCY) {
			latencyModule.pushURL(provider, language, url);
		} else if(test == FACTORS) {
			factorsModule.pushURL(provider, language, url);
		} else if (test == MEMORY) {
			// TODO: similar to latency urls
		} else if (test == FILESYSTEM) {
			// TODO: similar to latency urls
		}

	}
}

/** Cleans up (deletes) all functions and gateways on each cloud */
async function cleanup() {

	latencyModule.resetURLs();
	factorsModule.resetURLs();

	currentLogStatus += '<h4>Cleaning Up...</h4>';

	var promises = [];

	let p1 = cleanupAWS();
	promises.push(p1);
	
	let p2 = cleanupAzure();
	promises.push(p2);

	let p3 = cleanupGoogle();
	promises.push(p3);

	let p4 = cleanupIBM();
	promises.push(p4);

	await Promise.all(promises);

	currentLogStatusEnd += '<h4>Cleanup finished</h4>';
	runningStatus = false;

}

/** Cleanup Function for AWS */
async function cleanupAWS() {

	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusAWS += '<h5>Amazon Web Services (sequential cleanup)</h5>';
		currentLogStatusAWS += '<ul stlye="list-style-position: outside">';
		currentLogStatusAWSEnd += '</ul>';
		runningStatusAWS = true;

		let awsFunctions = [], awsGateways = [];

		var promises = [];

		for(let i = 0; i<config.aws.region_options.length; i++) {

			let p1 = execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli:1.16.216 aws lambda list-functions --region ' + config.aws.region_options[i])
			.then((stdout) => {
				let awslambda = JSON.parse(stdout);
				for(let i = 0; i<awslambda.Functions.length; i++) {
					awsFunctions.push(awslambda.Functions[i].FunctionName);
				}
			})
			.catch((err) => {
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Could not load existing AWS lambda functions</li>';
			});
			promises.push(p1);
	
			let p2 = execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli:1.16.216 aws apigateway get-rest-apis --region ' + config.aws.region_options[i])
			.then((stdout) => {
				let awsapi = JSON.parse(stdout);
				for(let i = 0; i<awsapi.items.length; i++) {
					awsGateways.push(awsapi.items[i].id);
				}
			})
			.catch((err) => {
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Could not load existing AWS APIs</li>';
			});
			promises.push(p2);

		}

		await Promise.all(promises);

		if(awsFunctions.length == 0 && awsGateways.length == 0) {
			currentLogStatusAWS += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
		}

		promises = [];

		for(let i = 0; i<awsFunctions.length; i++) {
			let start = now();
			let p = execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli:1.16.216 aws lambda delete-function --function-name ' + awsFunctions[i] + ' --region ' + config.aws.region)
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusAWS += '<li><span style="color:green">INFO:</span> Function "' + awsFunctions[i] + '" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> Function "' + awsFunctions[i] + '" could not be deleted</li>';
			});
			promises.push(p);

		}

		await Promise.all(promises);

		for(let i = 0; i<awsGateways.length; i++) {
			let start = now();
			if(i>0) {
				await new Promise(resolve => setTimeout(resolve, 30000));
			}
			await execShellCommand('docker run --rm -v aws-secrets:/root/.aws mikesir87/aws-cli:1.16.216 aws apigateway delete-rest-api --rest-api-id ' + awsGateways[i] + ' --region ' + config.aws.region)
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusAWS += '<li><span style="color:green">INFO:</span> API with ID "' + awsGateways[i] + '" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusAWS += '<li><span style="color:red">ERROR:</span> API with ID "' + awsGateways[i] + '" could not be deleted</li>';
			});
		}

		let end = now();
		currentLogStatusAWS += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusAWS = false;
		resolve();

	});
}

/** Cleanup Function for Azure */
async function cleanupAzure() {

	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusAzure += '<h5>Microsoft Azure (parallel cleanup)</h5>';
		currentLogStatusAzure += '<ul stlye="list-style-position: outside">';
		currentLogStatusAzureEnd += '</ul>';
		runningStatusAzure = true;

		let azureResourceGroups = [];

		await execShellCommand('docker run --rm -v azure-secrets:/root/.azure mcr.microsoft.com/azure-cli:2.0.71 az group list')
		.then((stdout) => {
			let azureresourcegroups = JSON.parse(stdout);
			for(let i = 0; i<azureresourcegroups.length; i++) {
				if(azureresourcegroups[i].name.includes('latency') || azureresourcegroups[i].name.includes('factors') || azureresourcegroups[i].name.includes('memory') || azureresourcegroups[i].name.includes('filesystem') || azureresourcegroups[i].name.includes('custom')) {
					azureResourceGroups.push(azureresourcegroups[i].name);
				}
			}
		})
		.catch((err) => {
			currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Could not load existing Azure resource groups</li>';
		});

		if(azureResourceGroups.length == 0) {
			currentLogStatusAzure += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
		}

		var promises = [];

		for(let i = 0; i<azureResourceGroups.length; i++) {
			let start = now();
			let p = execShellCommand('docker run --rm -v azure-secrets:/root/.azure mcr.microsoft.com/azure-cli:2.0.71 az group delete --name ' + azureResourceGroups[i] + ' --yes')
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusAzure += '<li><span style="color:green">INFO:</span> Function App in RG "' + azureResourceGroups[i] + '" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusAzure += '<li><span style="color:red">ERROR:</span> Function App in RG "' + azureResourceGroups[i] + '" could not be deleted</li>';
			});
			promises.push(p);
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusAzure += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusAzure = false;
		resolve();

	});

}

/** Cleanup Function for Google */
async function cleanupGoogle() {

	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusGoogle += '<h5>Google Cloud (parallel cleanup)</h5>';
		currentLogStatusGoogle += '<ul stlye="list-style-position: outside">';
		currentLogStatusGoogleEnd += '</ul>';
		runningStatusGoogle = true;

		let googleFunctions = [];

		await execShellCommand('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk:257.0.0-alpine gcloud functions list')
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
			currentLogStatusGoogle += '<li><span style="color:red">ERROR:</span> Could not load existing Google Cloud functions</li>';
		});

		if(googleFunctions.length == 0) {
			currentLogStatusGoogle += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
		}
		var promises = [];
		for(let i = 0; i<googleFunctions.length; i++) {
			let start = now();
			let p = execShellCommand('docker run --rm -v google-secrets:/root/.config/gcloud google/cloud-sdk:257.0.0-alpine gcloud functions delete ' + googleFunctions[i] + ' --region ' + config.google.region + ' --quiet')
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusGoogle += '<li><span style="color:green">INFO:</span> Function "' + googleFunctions[i] + '" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusGoogle += '<li><span style="color:red">ERROR:</span> Function "' + googleFunctions[i] + '" could not be deleted</li>';
			});
			promises.push(p);
		}

		await Promise.all(promises);

		let end = now();
		currentLogStatusGoogle += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusGoogle = false;
		resolve();

	});
	
}

/** Cleanup Function for IBM */
async function cleanupIBM() {

	return new Promise(async (resolve, reject) => {

		let start = now();

		currentLogStatusIBM += '<h5>IBM Cloud (sequential cleanup)</h5>';
		currentLogStatusIBM += '<ul stlye="list-style-position: outside">';
		currentLogStatusIBMEnd += '</ul>';
		runningStatusIBM = true;

		let ibmFunctions = [], ibmGateways = [];

		await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.18.0 ibmcloud fn api list')
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
				ibmGateways.push(parts[parts.length-1])
			}
		})
		.catch((err) => {
			currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Could not load existing IBM Cloud APIs</li>';
		});

		await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.18.0 ibmcloud fn action list')
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
				ibmFunctions.push(parts[2])
			}
		})
		.catch((err) => {
			currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Could not load existing IBM Cloud actions</li>';
		});

		if(ibmFunctions.length == 0 && ibmGateways.length == 0) {
			currentLogStatusIBM += '<li><span style="color:orange">SKIP:</span> Nothing to clean up.</li>';
		}

		for(let i = 0; i<ibmGateways.length; i++) {
			let start = now();
			await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.18.0 ibmcloud fn api delete / /' + ibmGateways[i])
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusIBM += '<li><span style="color:green">INFO:</span> Method "/' + ibmGateways[i] + '" on API Gateway "/" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Method "/' + ibmGateways[i] + '" on API Gateway "/" could not be deleted</li>';
			});
		}

		for(let i = 0; i<ibmFunctions.length; i++) {
			let start = now();
			await execShellCommand('docker run --rm -v ibm-secrets:/root/.bluemix ibmcom/ibm-cloud-developer-tools-amd64:0.18.0 ibmcloud fn action delete ' + ibmFunctions[i])
			.then((stdout) => {
				let end = now();
				let time = millisToMinutesAndSeconds((end-start).toFixed(3));
				currentLogStatusIBM += '<li><span style="color:green">INFO:</span> Action "' + ibmFunctions[i] + '" deleted ' + time + '</li>';
			})
			.catch((err) => {
				currentLogStatusIBM += '<li><span style="color:red">ERROR:</span> Action "' + ibmFunctions[i] + '" could not be deleted</li>';
			});
		}

		let end = now();
		currentLogStatusIBM += 'Completed ' + millisToMinutesAndSeconds((end-start).toFixed(3));

		runningStatusIBM = false;
		resolve();

	});
	
}