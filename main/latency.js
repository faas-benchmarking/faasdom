const request = require('request');
const fs = require('fs');

const AWS = 'aws';
const AZURE = 'azure';
const GOOGLE = 'google';
const IBM = 'ibm';

const NODE = 'node';
const PYTHON = 'python';
const GO = 'go';
const DOTNET = 'dotnet';

const providers = [AWS, AZURE, GOOGLE, IBM];
const languages = [NODE, PYTHON, GO, DOTNET];

const colorReset = '\x1b[0m';
const colorFgRed = '\x1b[31m';
const colorFgGreen = '\x1b[32m';
const colorFgYellow = '\x1b[33m';
const colorFgWhite = '\x1b[37m';

var start = undefined;

var rawdata = fs.readFileSync('latency_urls.json');
var urls = JSON.parse(rawdata);

function pushURL(provider, language, url) {
  if(providers.includes(provider) && languages.includes(language)) {
    urls.push({provider: provider, language: language, url: url, latest: colorFgWhite + '0' + colorReset, mean: 0});
    fs.writeFile('latency_urls.json', JSON.stringify(urls), function(err) {
      if (err) {
        console.log(err);
        process.exit(0);
      }
    });
    return true;
  }
  return false;
}

function resetURLs() {
  fs.writeFile('latency_urls.json', '[]', function(err) {
    if (err) {
      console.log(err);
      process.exit(0);
    }
  });
  urls = [];
}

async function getLatency() {

  for(let i = 0; i<urls.length; i++) {
    request.get({
      url : urls[i].url,
      time : true
    },function(err, response){
        urls[i].latest = colorResult(response.elapsedTime);
    });
  }

}

function colorResult(result) {
  let formattedResult = '';
  if(result <= 101) {
    formattedResult = colorFgGreen;
  } else if(result <= 501) {
    formattedResult = colorFgYellow;
  } else {
    formattedResult = colorFgRed;
  }
  formattedResult += result + colorReset;
  return formattedResult;
}

function printResults() {

    if(start == undefined) {
      start = new Date();
    }
    var now = new Date();
    var dif = now.getTime() - start.getTime();
    var difAsString = dif.toString();
    var difInSeconds = difAsString.substr(0, difAsString.length - 3);

    let lastAWSNode = (urls.find(x => x.provider == AWS && x.language == NODE) ? urls.find(x => x.provider == AWS && x.language == NODE).latest : colorFgWhite + '-' + colorReset);
    let lastAWSPython = (urls.find(x => x.provider == AWS && x.language == PYTHON) ? urls.find(x => x.provider == AWS && x.language == PYTHON).latest : colorFgWhite + '-' + colorReset);
    let lastAWSGo = (urls.find(x => x.provider == AWS && x.language == GO) ? urls.find(x => x.provider == AWS && x.language == GO).latest : colorFgWhite + '-' + colorReset);
    let lastAWSDotnet = (urls.find(x => x.provider == AWS && x.language == DOTNET) ? urls.find(x => x.provider == AWS && x.language == DOTNET).latest : colorFgWhite + '-' + colorReset);

    let lastAzureNode = (urls.find(x => x.provider == AZURE && x.language == NODE) ? urls.find(x => x.provider == AZURE && x.language == NODE).latest : colorFgWhite + '-' + colorReset);
    let lastAzurePython = (urls.find(x => x.provider == AZURE && x.language == PYTHON) ? urls.find(x => x.provider == AZURE && x.language == PYTHON).latest : colorFgWhite + '-' + colorReset);
    let lastAzureDotnet = (urls.find(x => x.provider == AZURE && x.language == DOTNET) ? urls.find(x => x.provider == AZURE && x.language == DOTNET).latest : colorFgWhite + '-' + colorReset);

    let lastGoogleNode = (urls.find(x => x.provider == GOOGLE && x.language == NODE) ? urls.find(x => x.provider == GOOGLE && x.language == NODE).latest : colorFgWhite + '-' + colorReset);
    let lastGooglePython = (urls.find(x => x.provider == GOOGLE && x.language == PYTHON) ? urls.find(x => x.provider == GOOGLE && x.language == PYTHON).latest : colorFgWhite + '-' + colorReset);
    let lastGoogleGo = (urls.find(x => x.provider == GOOGLE && x.language == GO) ? urls.find(x => x.provider == GOOGLE && x.language == GO).latest : colorFgWhite + '-' + colorReset);

    let lastIBMNode = (urls.find(x => x.provider == IBM && x.language == NODE) ? urls.find(x => x.provider == IBM && x.language == NODE).latest : colorFgWhite + '-' + colorReset);
    let lastIBMPython = (urls.find(x => x.provider == IBM && x.language == PYTHON) ? urls.find(x => x.provider == IBM && x.language == PYTHON).latest : colorFgWhite + '-' + colorReset);
    let lastIBMGo = (urls.find(x => x.provider == IBM && x.language == GO) ? urls.find(x => x.provider == IBM && x.language == GO).latest : colorFgWhite + '-' + colorReset);
    let lastIBMDotnet = (urls.find(x => x.provider == IBM && x.language == DOTNET) ? urls.find(x => x.provider == IBM && x.language == DOTNET).latest : colorFgWhite + '-' + colorReset);

    process.stdout.write('\033c');

    process.stdout.write("#==================================================================#\n");
    process.stdout.write("‖ Language |         Cloud Providers - Latency        Time: " + ' '.repeat(4 - difInSeconds.toString().length) + difInSeconds.toString() + " s ‖\n");
    process.stdout.write("‖          |-------------------------------------------------------‖\n");
    process.stdout.write("‖          |     AWS     |    Azure    |   Google    |     IBM     ‖\n");
    process.stdout.write("‖----------|-------------------------------------------------------‖\n");
    process.stdout.write("‖  Node.js | " + ' '.repeat(17 - lastAWSNode.toString().length) + lastAWSNode.toString() + " ms | " + ' '.repeat(17 - lastAzureNode.toString().length) + lastAzureNode.toString() + " ms | " + ' '.repeat(17 - lastGoogleNode.toString().length) + lastGoogleNode.toString() + " ms | " + ' '.repeat(17 - lastIBMNode.toString().length) + lastIBMNode.toString() + " ms ‖\n");
    process.stdout.write("‖----------|-------------------------------------------------------‖\n");
    process.stdout.write("‖  Python  | " + ' '.repeat(17 - lastAWSPython.toString().length) + lastAWSPython.toString() + " ms | " + ' '.repeat(17 - lastAzurePython.toString().length) + lastAzurePython.toString() + " ms | " + ' '.repeat(17 - lastGooglePython.toString().length) + lastGooglePython.toString() + " ms | " + ' '.repeat(17 - lastIBMPython.toString().length) + lastIBMPython.toString() + " ms ‖\n");
    process.stdout.write("‖----------|-------------------------------------------------------‖\n");
    process.stdout.write("‖  Go      | " + ' '.repeat(17 - lastAWSGo.toString().length) + lastAWSGo.toString() + " ms |             | " + ' '.repeat(17 - lastGoogleGo.toString().length) + lastGoogleGo.toString() + " ms | " + ' '.repeat(17 - lastIBMGo.toString().length) + lastIBMGo.toString() + " ms ‖\n");
    process.stdout.write("‖----------|-------------------------------------------------------‖\n");
    process.stdout.write("‖  .NET    | " + ' '.repeat(17 - lastAWSDotnet.toString().length) + lastAWSDotnet.toString() + " ms | " + ' '.repeat(17 - lastAzureDotnet.toString().length) + lastAzureDotnet.toString() + " ms |             | " + ' '.repeat(17 - lastIBMDotnet.toString().length) + lastIBMDotnet.toString() + " ms ‖\n");
    process.stdout.write("#==================================================================#\n");

}

module.exports = { getLatency, printResults, pushURL, resetURLs };