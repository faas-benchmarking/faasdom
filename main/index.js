// IMPORTANT: for python need to run (Azure CLI needs to use python 3.6):
// sudo apt-get install python3-venv -y
// python3.6 -m venv .env
// source .env/bin/activate

const readline = require('readline');
const latencyModule = require("./latency.js");
const inquirer = require('inquirer');
const fs = require('fs');
const execAwait = require('await-exec')
const { exec } = require('child-process-promise');


/** Colors */
let colorReset = "\x1b[0m"
let colorBright = "\x1b[1m"
let colorDim = "\x1b[2m"
let colorUnderscore = "\x1b[4m"
let colorBlink = "\x1b[5m"
let colorReverse = "\x1b[7m"
let colorHidden = "\x1b[8m"

let colorFgBlack = "\x1b[30m"
let colorFgRed = "\x1b[31m"
let colorFgGreen = "\x1b[32m"
let colorFgYellow = "\x1b[33m"
let colorFgBlue = "\x1b[34m"
let colorFgMagenta = "\x1b[35m"
let colorFgCyan = "\x1b[36m"
let colorFgWhite = "\x1b[37m"

let colorBgBlack = "\x1b[40m"
let colorBgRed = "\x1b[41m"
let colorBgGreen = "\x1b[42m"
let colorBgYellow = "\x1b[43m"
let colorBgBlue = "\x1b[44m"
let colorBgMagenta = "\x1b[45m"
let colorBgCyan = "\x1b[46m"
let colorBgWhite = "\x1b[47m"

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

/** inquirer question objects */
var providerQuestion = {
	type: 'checkbox',
	message: 'Select Cloud Providers you want to deploy',
	name: 'providers',
	choices: [
		{	name: 'Amazon Web Services' },
		{ name: 'Microsoft Azure' },
		{ name: 'Google Cloud' },
		{	name: 'IBM Cloud'	}
	],
	validate: function(answer) {
		if (answer.length < 1) {
			return 'You must choose at least one cloud provider.';
		}
		return true;
	}
};

var languageQuestion = {
	type: 'checkbox',
	message: 'Select Langues you want to deploy',
	name: 'languages',
	choices: [
		{ name: 'Node.js' },
		{ name: 'Python' },
		{	name: 'Go' },
		{ name: '.NET' }
	],
	validate: function(answer) {
		if (answer.length < 1) {
			return 'You must choose at least one programming language.';
		}
		return true;
	}
}


start();


/** main function */
async function start() {
	printOptions();
	loadConfig();
	const ans = await waitForUserInput("\n  --> ");
	let providers;
	let languages;
	switch (ans) {
		case '1':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '2':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '3':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '4':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '5':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '6':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			start();
			break;
		case '7':
			inquirer.prompt([providerQuestion])
			.then(async answers => {
				providers = answers;
				inquirer.prompt([languageQuestion])
				.then(async answers => {
					languages = answers;
					console.log('');
					console.log(colorFgYellow + '  Deploying Latency Test...' + colorReset);

					if(providers.providers.includes('Amazon Web Services')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Amazon Web Services' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(AWS, NODE, LATENCY, 'node_latency', 'node_latency', 'node_latency', 'nodejs8.10', 'index.handler', '../aws/src/node/node_latency/', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(AWS, PYTHON, LATENCY, 'python_latency', 'python_latency', 'python_latency', 'python3.6', 'function.my_handler', '../aws/src/python/python_latency/', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(AWS, GO, LATENCY, 'go_latency', 'go_latency', 'go_latency', 'go1.x', 'latency', '../aws/src/go/go_latency/', 'Go', '', '');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(AWS, DOTNET, LATENCY, 'dotnet_latency', 'dotnet_latency', 'dotnet_latency', 'dotnetcore2.1', 'Latency::Latency.LatencyHandler::HandleFunction', '../aws/src/dotnet/Latency/', '.NET', '', '');
						}
					}
					if(providers.providers.includes('Microsoft Azure')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Microsoft Azure' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(AZURE, NODE, LATENCY, 'node-latency', '', '', 'node', '', '../azure/src/node/node_latency', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(AZURE, PYTHON, LATENCY, 'python-latency', '', '', 'python', '', '../azure/src/python/python_latency', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							console.log(colorFgYellow + '    SKIP:' + colorReset + ' No Go runtime.');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(AZURE, DOTNET, LATENCY, 'dotnet-latency', '', '', 'dotnet', '', '../azure/src/dotnet/dotnet_latency', '.NET', '', '');
						}	

					}
					if(providers.providers.includes('Google Cloud')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Google Cloud' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(GOOGLE, NODE, LATENCY, 'node_latency', '', '', 'nodejs8', '', '../google/src/node/latency', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(GOOGLE, PYTHON, LATENCY, 'python_latency', '', '', 'python37', '', '../google/src/python/latency', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(GOOGLE, GO, LATENCY, 'Go_latency', '', '', 'go111', '', '../google/src/go/latency', 'Go', '', '');
						}
						if(languages.languages.includes('.NET')) {
							console.log(colorFgYellow + '    SKIP:' + colorReset + ' No .NET runtime.');
						}

					}
					if(providers.providers.includes('IBM Cloud')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'IBM Cloud' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(IBM, NODE, LATENCY, 'node_latency', 'node_latency', '', 'nodejs:10', '', '../ibm/src/node/latency/', 'Node.js', ' ', 'json');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(IBM, PYTHON, LATENCY, 'python_latency', 'python_latency', '', 'python:3.7', '', '../ibm/src/python/latency/main.py', 'Python', ' ', 'json');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(IBM, GO, LATENCY, 'go_latency', 'go_latency', '', 'go:1.11', '', '../ibm/src/go/latency/latency.go', 'Go', ' ', 'json');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(IBM, DOTNET, LATENCY, 'dotnet_latency', 'dotnet_latency', '', 'dotnet:2.2', '', '../ibm/src/dotnet/Latency/', '.NET', ' --main Latency::Latency.LatencyDotnet::Main', 'json')
						}
					}

					console.log(' ');
					console.log(colorFgGreen + '  Latency Test deployed.' + colorReset);
					console.log(' ');

					start();

				});
			});
			
			break;
		case '8':
			// TODO: only exit to menu, destory intervals
			let running = setInterval(function(){latencyModule.getLatency()}, 1000);
			let printing = setInterval(function(){latencyModule.printResults()}, 500);
			process.stdin.setRawMode(true);
			process.stdin.resume();
			process.stdin.on('data', process.exit.bind(process, 0));
			break;
		case '9':
			inquirer.prompt([providerQuestion
				])
				.then(async answers => {
					providers = answers;
				inquirer
				.prompt([languageQuestion
				])
				.then(async answers => {
					languages = answers;
					console.log('');
					console.log(colorFgYellow + '  Deploying CPU Test (factors)...' + colorReset);

					if(providers.providers.includes('Amazon Web Services')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Amazon Web Services' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(AWS, NODE, FACTORS, 'node_factors', 'node_factors', 'node_factors', 'nodejs8.10', 'index.handler', '../aws/src/node/node_factors/', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(AWS, PYTHON, FACTORS, 'python_factors', 'python_factors', 'python_factors', 'python3.6', 'function.my_handler', '../aws/src/python/python_factors/', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(AWS, GO, FACTORS, 'go_factors', 'go_factors', 'go_factors', 'go1.x', 'factors', '../aws/src/go/go_factors/', 'Go', '', '');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(AWS, DOTNET, FACTORS, 'dotnet_factors', 'dotnet_factors', 'dotnet_factors', 'dotnetcore2.1', 'Factors::Factors.FactorsHandler::HandleFunction', '../aws/src/dotnet/Factors/', '.NET', '', '');
						}
					}
					if(providers.providers.includes('Microsoft Azure')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Microsoft Azure' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(AZURE, NODE, FACTORS, 'node-factors', '', '', 'node', '', '../azure/src/node/node_factors', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(AZURE, PYTHON, FACTORS, 'python-factors', '', '', 'python', '', '../azure/src/python/python_factors', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							console.log(colorFgYellow + '    SKIP:' + colorReset + ' No Go runtime.');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(AZURE, DOTNET, FACTORS, 'dotnet-factors', '', '', 'dotnet', '', '../azure/src/dotnet/dotnet_factors', '.NET', '', '');
						}
					}
					if(providers.providers.includes('Google Cloud')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'Google Cloud' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(GOOGLE, NODE, FACTORS, 'node_factors', '', '', 'nodejs8', '', '../google/src/node/factors', 'Node.js', '', '');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(GOOGLE, PYTHON, FACTORS, 'python_factors', '', '', 'python37', '', '../google/src/python/factors', 'Python', '', '');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(GOOGLE, GO, FACTORS, 'Go_factors', '', '', 'go111', '', '../google/src/go/factors', 'Go', '', '');
						}
						if(languages.languages.includes('Go')) {
							console.log(colorFgYellow + '    SKIP:' + colorReset + ' No .NET runtime.');
						}
					}
					if(providers.providers.includes('IBM Cloud')) {

						console.log(' ');
						console.log('  ' + colorUnderscore + 'IBM Cloud' + colorReset);
						console.log(' ');

						if(languages.languages.includes('Node.js')) {
							await deployFunction(IBM, NODE, FACTORS, 'node_factors', 'node_factors', '', 'nodejs:10', '', '../ibm/src/node/factors/', 'Node.js', ' ', 'json');
						}
						if(languages.languages.includes('Python')) {
							await deployFunction(IBM, PYTHON, FACTORS, 'python_factors', 'python_factors', '', 'python:3.7', '', '../ibm/src/python/factors/main.py', 'Python', ' ', 'json');
						}
						if(languages.languages.includes('Go')) {
							await deployFunction(IBM, GO, FACTORS, 'go_factors', 'go_factors', '', 'go:1.11', '', '../ibm/src/go/factors/factors.go', 'Go', ' ', 'json');
						}
						if(languages.languages.includes('.NET')) {
							await deployFunction(IBM, DOTNET, FACTORS, 'dotnet_factors', 'dotnet_factors', '', 'dotnet:2.2', '', '../ibm/src/dotnet/Factors/', '.NET', ' --main Factors::Factors.FactorsDotnet::Main', 'json');
						}
					}

					console.log(' ');
					console.log(colorFgGreen + '  CPU Test (factors) deployed.' + colorReset);
					console.log(' ');

					start();

				});
				});
			break;
		case '10':
			console.log( colorFgYellow + ' INFO: Not yet implemented.' + colorReset);
			break;
		case '11':
			cleanup();
			break;
		case 'q':
			process.exit(1);
			break;
		default:
			console.log( colorFgRed + colorBright + ' ERROR: Invalid Input: ' + ans + colorReset);
			start();
			break;
	}
}

/** Wait for user to select option from the menu */
function waitForUserInput(query) {
	const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
	});
	return new Promise(resolve => rl.question(query, ans => {
			rl.close();
			resolve(ans);
	}))
}

/** load configurations from file */
function loadConfig() {
	config_file = fs.readFileSync("./config.json");
	config = JSON.parse(config_file);
}

/** Overview menu printing */
function printOptions() {
	console.log('#==============================================================================#');
	console.log('‖                          Serverless Benchmark Suite                          ‖');
	console.log('#==============================================================================#');
	console.log(' ');
	console.log('  What do you want to do? (enter q to exit)');
	console.log('  ----------------------------------------------------------------------------  ');
	console.log('  1) ...                                7) Deploy Latency Test');
	console.log('  2) ...                                8) Run Latency Test');
	console.log('  3) ...                                9) Deploy CPU Test (factors)');
	console.log('  4) ...                               10) Run CPU Test (factors)')
	console.log('  5) ...                               11) Cleanup all (' + colorFgRed + 'CAUTION!' + colorReset + ' deletes all ');
	console.log('  6) ...                                   functions & gateways in all clouds!)');
}

/** Deploy a function */
async function deployFunction(provider, language, test, functionName, APIName, APIPath, runtime, handler, srcPath, languageName, mainMethod, responseType) {
	if(providers.includes(provider) && language.includes(language)) {

		let url = '';

		if(provider == AWS) {
			if(language == NODE) {
				await execAwait('cd ' + srcPath + ' && npm install && zip -r -0 ' + functionName + '.zip * && cd ../../../../main');
				srcPath = 'fileb://' + srcPath + functionName + '.zip';
			} else if(language == PYTHON) {
				await execAwait('cd ' + srcPath + ' && zip -r -0 ' + functionName + '.zip * && cd ../../../../main');
				srcPath = 'fileb://' + srcPath + functionName + '.zip';
			} else if(language == GO) {
				await execAwait('cd ' + srcPath + ' && go build * && zip -r -0 ' + functionName + '.zip * --exclude "*.go" && cd ../../../../main');
				srcPath = 'fileb://' + srcPath + functionName + '.zip';
			} else if(language == DOTNET) {
				await execAwait('cd ' + srcPath + ' && dotnet build && dotnet lambda package -c Release -o ' + functionName + '.zip -f netcoreapp2.1 && cd ../../../../main');
				srcPath = 'fileb://' + srcPath + functionName + '.zip';
			}

			await execAwait('aws lambda create-function --function-name ' + functionName + ' --runtime ' + runtime + ' --role ' + config.aws.arn_role + ' --memory-size ' + config.global.memory + ' --handler ' + handler + ' --zip-file ' + srcPath + ' --region ' + config.aws.region + ' --timeout ' + config.global.timeout);
			let lambdaarn = await exec('aws lambda list-functions --query "Functions[?FunctionName==\\`' + functionName + '\\`].FunctionArn" --output text --region ' + config.aws.region);
			lambdaarn = lambdaarn.stdout.replace('\n', '');
			await execAwait('aws apigateway create-rest-api --name "' + APIName + '" --description "Api for ' + functionName + '" --region ' + config.aws.region);
			let apiid = await exec('aws apigateway get-rest-apis --query "items[?name==\\`' + APIName + '\\`].id" --output text --region ' + config.aws.region);
			apiid = apiid.stdout.replace('\n', '');
			let parentresourceid = await exec('aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/\\`].id" --output text --region ' + config.aws.region);
			parentresourceid = parentresourceid.stdout.replace('\n', '');
			await execAwait('aws apigateway create-resource --rest-api-id ' + apiid + ' --parent-id ' + parentresourceid + ' --path-part ' + APIPath + ' --region ' + config.aws.region);
			let resourceid = await exec('aws apigateway get-resources --rest-api-id ' + apiid + ' --query "items[?path==\\`/' + APIPath + '\\`].id" --output text --region ' + config.aws.region);
			resourceid = resourceid.stdout.replace('\n', '');
			await exec('aws apigateway put-method --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --authorization-type NONE --region ' + config.aws.region);
			await exec('aws apigateway put-integration --rest-api-id ' + apiid + ' --resource-id ' + resourceid + ' --http-method ANY --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:' + config.aws.region + ':lambda:path/2015-03-31/functions/' + lambdaarn + '/invocations --region ' + config.aws.region);
			await execAwait('aws apigateway create-deployment --rest-api-id ' + apiid + ' --stage-name test --region ' + config.aws.region);
			let apiarn = await exec('echo ' + lambdaarn + ' | sed -e "s/lambda/execute-api/" -e "s/function:' + functionName + '/' + apiid + '/"');
			apiarn = apiarn.stdout.replace('\n', '');
			await execAwait('aws lambda add-permission --function-name ' + functionName + ' --statement-id ' + functionName + ' --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "' + apiarn + '/*/*/' + APIPath + '" --region ' + config.aws.region);
			url = 'https://' + apiid + '.execute-api.' + config.aws.region + '.amazonaws.com/test/' + APIPath;
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Deployed ' + languageName + ' function.');
		} 
		
		else if(provider == AZURE) {
			if(language == NODE) {
				await execAwait('cd ' + srcPath + ' && npm install && cd ../../../../main');
			}
			await execAwait('az functionapp create --resource-group ' + config.azure.resourcegroupname + ' --consumption-plan-location ' + config.azure.region + ' --name ' + functionName + ' --storage-account ' + config.azure.storagename + ' --runtime ' + runtime + ' --os-type Linux');
			await execAwait('cd ' + srcPath + ' && func azure functionapp publish ' + functionName + ' && cd ../../../../main');
			url = 'https://' + functionName + '.azurewebsites.net/api/' + test;
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Deployed ' + languageName + ' function.');
		}
		
		else if(provider == GOOGLE) {
			await execAwait('gcloud functions deploy ' + functionName + ' --region=' + config.google.region + ' --memory=' + config.global.memory + config.google.memory_appendix + ' --timeout=' + config.global.timeout + config.google.timeout_appendix + ' --runtime=' + runtime + ' --trigger-http --source=' + srcPath);
			url = 'https://' + config.google.region + '-' + config.google.project + '.cloudfunctions.net/' + functionName;
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Deployed ' + languageName + ' function.');
		}
		
		else if(provider == IBM) {
			if(language == NODE) {
				await execAwait('cd ' + srcPath + ' && npm install && zip -r -0 ' + functionName + '.zip * && cd ../../../../main');
				srcPath = srcPath + functionName + '.zip';
			} else if(language == DOTNET) {
				await execAwait('cd ' + srcPath + ' && dotnet publish -c Release -o out && cd out && zip -r -0 ../' + functionName + '.zip * && cd ../../../../../main');
				srcPath = srcPath + functionName + '.zip';
			}
			await execAwait('ibmcloud fn action create ' + functionName + ' ' + srcPath + mainMethod + ' --kind ' + runtime + ' --memory ' + config.global.memory + ' --timeout ' +  config.global.timeout + '000 --web true && ibmcloud fn api create /' + APIName + ' get ' + functionName + ' --response-type ' + responseType);
			url = 'https://eu-de.functions.cloud.ibm.com/api/v1/web/' + config.ibm.organization + '_' + config.ibm.space + '/default/' + APIName + '.' + responseType;
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Deployed ' + languageName + ' function.');
		}


		if(test == LATENCY) {
			latencyModule.pushURL(provider, language, url);
		} else if(test == FACTORS) {
			//TODO: implement
		}

	}
}

/** Cleans up (deletes) all functions and gateways on each cloud */
async function cleanup() {

	console.log(' ');
	console.log('  Cleaning Up...');

	let allFunctions = await loadDeployedFunctions();

	latencyModule.resetURLs();

	console.log(' ');
	console.log('  ' + colorUnderscore + 'Amazon Web Services' + colorReset);
	console.log(' ');

	if(allFunctions.awsFunctions.length == 0 && allFunctions.awsGateways.length == 0) {
		console.log(colorFgYellow + '    SKIP:' + colorReset + ' Nothing to clean up.');
	}

	for(let i = 0; i<allFunctions.awsFunctions.length; i++) {
		try {
			await execAwait('aws lambda delete-function --function-name ' + allFunctions.awsFunctions[i]);
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Function "' + allFunctions.awsFunctions[i] + '" deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' Function "' + allFunctions.awsFunctions[i] + '" could not be deleted.');
		}
	}

	for(let i = 0; i<allFunctions.awsGateways.length; i++) {
		try {
			await execAwait('aws apigateway delete-rest-api --rest-api-id ' + allFunctions.awsGateways[i]);
			console.log(colorFgGreen + '    INFO:' + colorReset + ' API with ID "' + allFunctions.awsGateways[i] + '"  deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' API with ID "' + allFunctions.awsGateways[i] + '" could not be deleted.');
		}
	}

	console.log(' ');
	console.log('  ' + colorUnderscore + 'Microsoft Azure' + colorReset);
	console.log(' ');

	if(allFunctions.azureFunctions.length == 0) {
		console.log(colorFgYellow + '    SKIP:' + colorReset + ' Nothing to clean up.');
	}

	for(let i = 0; i<allFunctions.azureFunctions.length; i++) {
		try {
			await execAwait('az functionapp delete --name ' + allFunctions.azureFunctions[i] + ' --resource-group ' + config.azure.resourcegroupname);
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Function App "' + allFunctions.azureFunctions[i] + '" deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' Function App "' + allFunctions.azureFunctions[i] + '" could not be deleted.');
		}
	}

	console.log(' ');
	console.log('  ' + colorUnderscore + 'Google Cloud' + colorReset);
	console.log(' ');

	if(allFunctions.googleFunctions.length == 0) {
		console.log(colorFgYellow + '    SKIP:' + colorReset + ' Nothing to clean up.');
	}

	for(let i = 0; i<allFunctions.googleFunctions.length; i++) {
		try {
			await execAwait('gcloud functions delete ' + allFunctions.googleFunctions[i] + ' --region ' + config.google.region + ' --quiet');
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Function "' + allFunctions.googleFunctions[i] + '" deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' Function "' + allFunctions.googleFunctions[i] + '" could not be deleted.');
		}
	}

	console.log(' ');
	console.log('  ' + colorUnderscore + 'IBM Cloud' + colorReset);
	console.log(' ');

	if(allFunctions.ibmFunctions.length == 0 && allFunctions.ibmGateways.length == 0) {
		console.log(colorFgYellow + '    SKIP:' + colorReset + ' Nothing to clean up.');
	}

	for(let i = 0; i<allFunctions.ibmGateways.length; i++) {
		try {
			await execAwait('ibmcloud fn api delete / /' + allFunctions.ibmGateways[i]);
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' Method "/' + allFunctions.ibmGateways[i] + '" on API Gateway "/" could not be deleted.');
		}
	}

	for(let i = 0; i<allFunctions.ibmFunctions.length; i++) {
		try {
			await execAwait('ibmcloud fn action delete ' + allFunctions.ibmFunctions[i]);
			console.log(colorFgGreen + '    INFO:' + colorReset + ' Action "' + allFunctions.ibmFunctions[i] + '" deleted.');
		} catch(err) {
			console.log(colorFgRed + '    ERROR:' + colorReset + ' Action "' + allFunctions.ibmFunctions[i] + '" could not be deleted.');
		}
	}

	console.log(' ');

	start();
}

/** Loads all deployed functions on all cloud, used by cleanup process */
async function loadDeployedFunctions() {

	let awsFunctions = [], awsGateways = [], googleFunctions = [], azureFunctions = [], ibmFunctions = [], ibmGateways = [];

	let awslambda = await exec('aws lambda list-functions');
  awslambda = JSON.parse(awslambda.stdout);
	for(let i = 0; i<awslambda.Functions.length; i++) {
		awsFunctions.push(awslambda.Functions[i].FunctionName);
	}

	let awsapi = await exec('aws apigateway get-rest-apis');
	awsapi = JSON.parse(awsapi.stdout);
	for(let i = 0; i<awsapi.items.length; i++) {
		awsGateways.push(awsapi.items[i].id);
	}

	let googlefunctions = await exec('gcloud functions list');
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

	let azurefunctions = await exec('az functionapp list');
	azurefunctions = JSON.parse(azurefunctions.stdout);
	for(let i = 0; i<azurefunctions.length; i++) {
		azureFunctions.push(azurefunctions[i].name);
	}

	let ibmapi = await exec('ibmcloud fn api list');
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

	let ibmactions = await exec('ibmcloud fn action list');
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

	return {awsFunctions, awsGateways, googleFunctions, azureFunctions, ibmFunctions, ibmGateways};
}