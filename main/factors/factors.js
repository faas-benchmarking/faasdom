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
      measurement: 'factors',
      fields: {
        ms: Influx.FieldType.INTEGER,
        successful: Influx.FieldType.BOOLEAN
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

var rawdata = fs.readFileSync('./factors/factors_urls.json');
var urls = JSON.parse(rawdata);

function pushURL(provider, language, url) {
  if(providers.includes(provider) && languages.includes(language)) {
    urls.push({provider: provider, language: language, url: url});
    fs.writeFile('./factors/factors_urls.json', JSON.stringify(urls), function(err) {
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
  fs.writeFile('./factors/factors_urls.json', '[]', function(err) {
    if (err) {
      console.error(err);
      process.exit(0);
    }
  });
  urls = [];
}

async function getFactors(n) {
  for(let i = 0; i<urls.length; i++) {
    request.get({
      url : urls[i].url,
      qs: {n: n},
      time : true
    },function(err, response){
        let data = JSON.parse(response.body);
        let success = false;
        if(data.success != undefined && data.success == true) {
            success = true;
        }
        insertIntoDB(response.elapsedTime, success, urls[i].language, urls[i].provider)
        urls[i].latest = response.elapsedTime;
    });
  }
}

function insertIntoDB(ms, success, language, provider) {
  influx.writePoints([
    {
      measurement: 'factors',
      tags: {
        test: 'secondTest',
        language: language,
        provider: provider
      },
      fields: {
        ms: ms,
        successful: success
      }
    }
  ])
  .catch((err) => {
    console.error(err);
    console.error('Could not write to DB!');
  });
}

module.exports = { getFactors, pushURL, resetURLs };