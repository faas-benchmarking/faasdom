const request = require('request');
const fs = require('fs');
const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: 'db',
  port: 8086,
  database: 'results',
  username: 'benchmark-suite',
  password: 'benchmark',
  schema: [
    {
      measurement: 'latency',
      fields: {
        ms: Influx.FieldType.INTEGER
      },
      tags: ['test', 'provider', 'language']
    }
  ]
});

const AWS = 'aws';
const AZURE = 'azure';
const AZUREWINDOWS = 'azureWindows';
const GOOGLE = 'google';
const IBM = 'ibm';

const NODE = 'node';
const PYTHON = 'python';
const GO = 'go';
const DOTNET = 'dotnet';

const providers = [AWS, AZURE, AZUREWINDOWS, GOOGLE, IBM];
const languages = [NODE, PYTHON, GO, DOTNET];

var start = undefined;

var rawdata = fs.readFileSync('latency_urls.json');
var urls = JSON.parse(rawdata);

function pushURL(provider, language, url) {
  if(providers.includes(provider) && languages.includes(language)) {
    urls.push({provider: provider, language: language, url: url, latest: '0', mean: 0});
    fs.writeFile('latency_urls.json', JSON.stringify(urls), function(err) {
      if (err) {
        console.error(err);
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
      console.error(err);
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
        insertIntoDB(response.elapsedTime, urls[i].language, urls[i].provider)
        urls[i].latest = response.elapsedTime;
    });
  }
}

function insertIntoDB(ms, language, provider) {
  influx.writePoints([
    {
      measurement: 'latency',
      tags: {
        test: 'secondTest',
        language: language,
        provider: provider
      },
      fields: {
        ms: ms
      }
    }
  ])
  .catch((err) => {
    console.error(err);
    console.error('Could not write to DB!');
  });
}

/** Deprecated */
/*function printResults() {

    if(start == undefined) {
      start = new Date();
    }
    var now = new Date();
    var dif = now.getTime() - start.getTime();
    var difAsString = dif.toString();
    var difInSeconds = difAsString.substr(0, difAsString.length - 3);

    let lastAWSNode = (urls.find(x => x.provider == AWS && x.language == NODE) ? urls.find(x => x.provider == AWS && x.language == NODE).latest : '-');
    let lastAWSPython = (urls.find(x => x.provider == AWS && x.language == PYTHON) ? urls.find(x => x.provider == AWS && x.language == PYTHON).latest : '-');
    let lastAWSGo = (urls.find(x => x.provider == AWS && x.language == GO) ? urls.find(x => x.provider == AWS && x.language == GO).latest : '-');
    let lastAWSDotnet = (urls.find(x => x.provider == AWS && x.language == DOTNET) ? urls.find(x => x.provider == AWS && x.language == DOTNET).latest : '-');

    let lastAzureNode = (urls.find(x => x.provider == AZURE && x.language == NODE) ? urls.find(x => x.provider == AZURE && x.language == NODE).latest : '-');
    let lastAzurePython = (urls.find(x => x.provider == AZURE && x.language == PYTHON) ? urls.find(x => x.provider == AZURE && x.language == PYTHON).latest : '-');
    let lastAzureDotnet = (urls.find(x => x.provider == AZURE && x.language == DOTNET) ? urls.find(x => x.provider == AZURE && x.language == DOTNET).latest : '-');

    let lastGoogleNode = (urls.find(x => x.provider == GOOGLE && x.language == NODE) ? urls.find(x => x.provider == GOOGLE && x.language == NODE).latest : '-');
    let lastGooglePython = (urls.find(x => x.provider == GOOGLE && x.language == PYTHON) ? urls.find(x => x.provider == GOOGLE && x.language == PYTHON).latest : '-');
    let lastGoogleGo = (urls.find(x => x.provider == GOOGLE && x.language == GO) ? urls.find(x => x.provider == GOOGLE && x.language == GO).latest : '-');

    let lastIBMNode = (urls.find(x => x.provider == IBM && x.language == NODE) ? urls.find(x => x.provider == IBM && x.language == NODE).latest : '-');
    let lastIBMPython = (urls.find(x => x.provider == IBM && x.language == PYTHON) ? urls.find(x => x.provider == IBM && x.language == PYTHON).latest : '-');
    let lastIBMGo = (urls.find(x => x.provider == IBM && x.language == GO) ? urls.find(x => x.provider == IBM && x.language == GO).latest : '-');
    let lastIBMDotnet = (urls.find(x => x.provider == IBM && x.language == DOTNET) ? urls.find(x => x.provider == IBM && x.language == DOTNET).latest : '-');

    let result = '';

    result += "#==================================================================#\n<br>";
    result += "‖ Language | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cloud Providers - Latency &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Time: " + '&nbsp;'.repeat(4 - difInSeconds.toString().length) + difInSeconds.toString() + " s ‖\n<br>";
    result += "‖ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |-------------------------------------------------------‖\n<br>";
    result += "‖ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; AWS &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp; Azure &nbsp;&nbsp; | &nbsp; Google &nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; IBM &nbsp;&nbsp;&nbsp; ‖\n<br>";
    result += "‖----------|-------------------------------------------------------‖\n<br>";
    result += "‖ &nbsp;Node.js | " + '&nbsp;'.repeat(8 - lastAWSNode.toString().length) + lastAWSNode.toString() + " ms | " + '&nbsp;'.repeat(8 - lastAzureNode.toString().length) + lastAzureNode.toString() + " ms | " + '&nbsp;'.repeat(8 - lastGoogleNode.toString().length) + lastGoogleNode.toString() + " ms | " + '&nbsp;'.repeat(8 - lastIBMNode.toString().length) + lastIBMNode.toString() + " ms ‖\n<br>";
    result += "‖----------|-------------------------------------------------------‖\n<br>";
    result += "‖ &nbsp;Python &nbsp;| " + '&nbsp;'.repeat(8 - lastAWSPython.toString().length) + lastAWSPython.toString() + " ms | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | " + '&nbsp;'.repeat(8 - lastGooglePython.toString().length) + lastGooglePython.toString() + " ms | " + '&nbsp;'.repeat(8 - lastIBMPython.toString().length) + lastIBMPython.toString() + " ms ‖\n<br>";
    result += "‖----------|-------------------------------------------------------‖\n<br>";
    result += "‖ &nbsp;Go &nbsp;&nbsp;&nbsp;&nbsp; | " + '&nbsp;'.repeat(8 - lastAWSGo.toString().length) + lastAWSGo.toString() + " ms | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | " + '&nbsp;'.repeat(8 - lastGoogleGo.toString().length) + lastGoogleGo.toString() + " ms | " + '&nbsp;'.repeat(8 - lastIBMGo.toString().length) + lastIBMGo.toString() + " ms ‖\n<br>";
    result += "‖----------|-------------------------------------------------------‖\n<br>";
    result += "‖ &nbsp;.NET &nbsp;&nbsp; | " + '&nbsp;'.repeat(8 - lastAWSDotnet.toString().length) + lastAWSDotnet.toString() + " ms | " + '&nbsp;'.repeat(8 - lastAzureDotnet.toString().length) + lastAzureDotnet.toString() + " ms | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | " + '&nbsp;'.repeat(8 - lastIBMDotnet.toString().length) + lastIBMDotnet.toString() + " ms ‖\n<br>";
    result += "#==================================================================#\n<br>";

    // Azure Python: " + '&nbsp;'.repeat(8 - lastAzurePython.toString().length) + lastAzurePython.toString() + " ms

    return result;
}*/

//module.exports = { getLatency, printResults, pushURL, resetURLs };
module.exports = { getLatency, pushURL, resetURLs };