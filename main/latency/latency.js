const request = require('request');
const fs = require('fs');
const Influx = require('influx');
const constants = require('../constants.js')

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
        ms: Influx.FieldType.INTEGER,
        success: Influx.FieldType.BOOLEAN
      },
      tags: ['test', 'provider', 'language', 'memory']
    }
  ]
});

var rawdata = fs.readFileSync('./latency/latency_urls.json');
var urls = JSON.parse(rawdata);

function pushURL(provider, language, url, memory) {
  if(constants.PROVIDERS.includes(provider) && constants.LANGUAGES.includes(language)) {
    urls.push({provider: provider, language: language, url: url, memory: memory});
    fs.writeFile('./latency/latency_urls.json', JSON.stringify(urls), function(err) {
      if (err) {
        console.error(err);
        // TODO: rejection instead of exit
        process.exit(0);
      }
    });
    return true;
  }
  return false;
}

function resetURLs() {
  fs.writeFile('./latency/latency_urls.json', '[]', function(err) {
    if (err) {
      console.error(err);
      process.exit(0);
    }
  });
  urls = [];
}

async function getLatency(testName) {
  for(let i = 0; i<urls.length; i++) {
    request.get({
      url : urls[i].url,
      time : true
    },function(err, response, body){

        let jsonBody;
        let success = false;
        try {
          jsonBody = JSON.parse(body);

          if(!jsonBody.hasOwnProperty('success')) {
            success = false;
          } else {
            success = jsonBody.success;
          }

          insertIntoDB(testName, response.elapsedTime, success, urls[i].language, urls[i].provider, urls[i].memory);

        } catch (e) {
          console.error(e);

          console.error('Latency test from ' + urls[i].provider + ' in langauge ' + urls[i].language + ' with body:');
          console.error(body);
          console.error('Statuscode: ' + response.statusCode);
          console.error('\n');

          insertIntoDB(testName, response.elapsedTime, false, urls[i].language, urls[i].provider);
        }

        
    });
  }
}

function insertIntoDB(testName, ms, success, language, provider, memory) {
  influx.writePoints([
    {
      measurement: 'latency',
      tags: {
        test: testName,
        language: language,
        provider: provider,
        memory: memory
      },
      fields: {
        ms: ms,
        success: success
      }
    }
  ])
  .catch((err) => {
    console.error(err);
    console.error('Could not write to DB!');
  });
}

module.exports = { getLatency, pushURL, resetURLs };