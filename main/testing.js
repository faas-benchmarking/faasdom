const request = require('request');
const fs = require('fs');
const Influx = require('influx');
const constants = require('./constants.js')

const tags = ['test', 'provider', 'language', 'memory', 'region'];

const influx = new Influx.InfluxDB({
    host: 'localhost',
    port: 8086,
    database: 'results',
    username: 'benchmark-suite',
    password: 'benchmark',
    schema: [
        {
            measurement: constants.LATENCY,
            fields: {
                ms: Influx.FieldType.INTEGER,
                success: Influx.FieldType.BOOLEAN
            },
            tags: tags
        },
        {
            measurement: constants.FACTORS,
            fields: {
                ms: Influx.FieldType.INTEGER,
                measured_ms: Influx.FieldType.FLOAT,
                success: Influx.FieldType.BOOLEAN
            },
            tags: tags
        },
        {
            measurement: constants.MATRIX,
            fields: {
                ms: Influx.FieldType.INTEGER,
                measured_ms: Influx.FieldType.FLOAT,
                success: Influx.FieldType.BOOLEAN
            },
            tags: tags
        },
        {
            measurement: constants.FILESYSTEM,
            fields: {
                ms: Influx.FieldType.INTEGER,
                measured_read_ms: Influx.FieldType.FLOAT,
                measured_write_ms: Influx.FieldType.FLOAT,
                measured_ms: Influx.FieldType.FLOAT,
                success: Influx.FieldType.BOOLEAN
            },
            tags: tags
        },
        {
            measurement: constants.CUSTOM,
            fields: {
                ms: Influx.FieldType.INTEGER,
                measured_ms: Influx.FieldType.FLOAT,
                success: Influx.FieldType.BOOLEAN
            },
            tags: tags
        }
    ]
});

var allUrls = {
    latency: [],
    factors: [],
    matrix: [],
    filesystem: [],
    custom: []
};

for(let i = 0; i<constants.TESTS.length; i++) {
    var rawdata = fs.readFileSync('./urls/'+constants.TESTS[i]+'_urls.json');
    var urls = JSON.parse(rawdata);
    allUrls[constants.TESTS[i]] = urls;
}

function pushURL(test, provider, language, url, memory, region) {
    if(constants.PROVIDERS.includes(provider) && constants.LANGUAGES.includes(language)) {
        let index = constants.TESTS.findIndex(x => x == test);
        allUrls[test].push({provider: provider, language: language, url: url, memory: memory, region: region});
        fs.writeFile('./urls/'+constants.TESTS[index]+'_urls.json', JSON.stringify(allUrls[test]), function(err) {
            if (err) {
                console.error(err);
            }
        });
        return true;
    }
    return false;
}

function resetURLs() {
    for(let i = 0; i<Object.keys(allUrls).length; i++) {
        fs.writeFile('./urls/'+constants.TESTS[i]+'_urls.json', '[]', function(err) {
            if (err) {
                console.error(err);
            }
        });
    }
    allUrls = {
        latency: [],
        factors: [],
        matrix: [],
        filesystem: [],
        custom: []
    };
}

async function get(test, testName, qs) {
    for(let i = 0; i<allUrls[test].length; i++) {
        request.get({
        url : allUrls[test][i].url,
        qs: qs,
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

                let measured_ms = 0;
                if(!jsonBody.hasOwnProperty('payload').hasOwnProperty('time')) {
                    measured_ms = jsonBody.payload.time;
                }

                let measured_write_ms = 0;
                if(!jsonBody.hasOwnProperty('payload').hasOwnProperty('timewrite')) {
                    measured_write_ms = jsonBody.payload.timewrite;
                }

                let measured_read_ms = 0;
                if(!jsonBody.hasOwnProperty('payload').hasOwnProperty('timeread')) {
                    measured_read_ms = jsonBody.payload.timeread;
                }

                let n = 0;
                if(!jsonBody.hasOwnProperty('payload').hasOwnProperty('n')) {
                    n = jsonBody.payload.n;
                }

                insertIntoDB(test, testName, response.elapsedTime, success, allUrls[test][i].language, allUrls[test][i].provider, allUrls[test][i].memory, allUrls[test][i].region, measured_ms, measured_write_ms, measured_read_ms, n);

            } catch (e) {
                console.error(e);
                insertIntoDB(test, testName, -1, false, allUrls[test][i].language, allUrls[test][i].provider, allUrls[test][i].memory, allUrls[test][i].region, -1, -1, -1, -1);
            }

        });
    }
}

function insertIntoDB(test, testName, ms, success, language, provider, memory, region, measured_ms, measured_write_ms, measured_read_ms, n) {

    var data = [
        {
          measurement: test,
          tags: {
            test: testName,
            language: language,
            provider: provider,
            memory: memory,
            region: region
          },
          fields: {
            ms: ms,
            success: success
          }
        }
    ];

    if(test == constants.FACTORS || test == constants.MATRIX || test == constants.FILESYSTEM || test == constants.CUSTOM) {
        data[0].fields.measured_ms = measured_ms;
    }

    if(test == constants.FILESYSTEM) {
        data[0].fields.measured_write_ms = measured_write_ms;
        data[0].fields.measured_read_ms = measured_read_ms;
    }

    influx.writePoints(data)
    .catch((err) => {
        console.error(err);
        console.error('Could not write to DB!');
    });
}

module.exports = { get, pushURL, resetURLs };