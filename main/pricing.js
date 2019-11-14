const Influx = require('influx');

const influx = new Influx.InfluxDB({
    host: 'localhost',
    port: 8086,
    database: 'results',
    username: 'benchmark-suite',
    password: 'benchmark',
    schema: []
});

// in MB resp. GHz (only to be used for Google)
const functionSizes = [
    {memory:  128, cpu: 0.2},
    {memory:  256, cpu: 0.4},
    {memory:  512, cpu: 0.8},
    {memory: 1024, cpu: 1.4},
    {memory: 2048, cpu: 2.4}
];

// as of 11.11.2019 all in USD
const prices = {
    /* 
        AWS updated on 11.11.2019
        https://aws.amazon.com/de/lambda/pricing/
        https://aws.amazon.com/de/ec2/pricing/on-demand/
    */
    aws: {
        perCall: 0.0000002,
        perGBSec: 0.0000166667,
        perGHzSec: 0,
        perGBNetwork: 0.09,
        freeCalls: 1000000,
        freeGBSec: 400000,
        freeGHzSec: 0,
        freeGBNetwork: 1,
    },
    /*
        Azure updated on 11.11.2019
        https://azure.microsoft.com/en-us/pricing/details/functions/
        https://azure.microsoft.com/en-us/pricing/details/bandwidth/
        https://azure.microsoft.com/en-us/pricing/details/storage/files/     INFO: Storage price not included, since it should be practically nothing < 0.10 $
    */
    azure: {
        perCall: 0.0000002,
        perGBSec: 0.000016,
        perGHzSec: 0,
        perGBNetwork: 0.087,
        freeCalls: 1000000,
        freeGBSec: 400000,
        freeGHzSec: 0,
        freeGBNetwork: 5,
    },
    /*
        Google updated on 11.11.2019
        https://cloud.google.com/functions/pricing#invocations
        https://cloud.google.com/functions/pricing-summary
    */
    google: {
        perCall: 0.0000004,
        perGBSec: 0.0000025,
        perGHzSec: 0.0000100,
        perGBNetwork: 0.12,
        freeCalls: 2000000,
        freeGBSec: 400000,
        freeGHzSec: 200000,
        freeGBNetwork: 5,
    },
    /*
        IBM updated on 11.11.2019
        https://cloud.ibm.com/functions/learn/pricing
    */
    ibm: {
        perCall: 0,
        perGBSec: 0.000017,
        perGHzSec: 0,
        perGBNetwork: 0,
        freeCalls: 0,
        freeGBSec: 400000,
        freeGHzSec: 0,
        freeGBNetwork: 0,
    },
}

/**
 * calculate the price
 * @param {number} calls - the amount of calls
 * @param {number} execTime - execution time in ms
 * @param {number} kb - the size of the return body in KB
 * @param {number} memory - the amount of memory allocated in MB
 * @param {string} privder - name of the provider ["aws", "azure", "google", "ibm"]
 */
function calcPrice(calls, execTime, kb, memory, provider) {

    let invocations_net = (calls-prices[provider].freeCalls) > 0 ? (calls-prices[provider].freeCalls) : 0;
    let gb_seconds_net = ((execTime/1000*calls*memory)/1024)-prices[provider].freeGBSec > 0 ? ((execTime/1000*calls*memory)/1024)-prices[provider].freeGBSec : 0;
    let ghz_seconds_net = (execTime/1000*calls*functionSizes[functionSizes.findIndex(x => x.memory == memory)].cpu)-prices[provider].freeGHzSec > 0 ? (execTime/1000*calls*functionSizes[functionSizes.findIndex(x => x.memory == memory)].cpu)-prices[provider].freeGHzSec : 0;
    let networking_net = (calls*kb/1024/1024)-prices[provider].freeGBNetwork > 0 ? (calls*kb/1024/1024)-prices[provider].freeGBNetwork : 0;

    let ghz_seconds_gross = (execTime/1000*calls*functionSizes[functionSizes.findIndex(x => x.memory == memory)].cpu);

    if(provider != "google") {
        ghz_seconds_net = 0;
        ghz_seconds_gross = 0;
    }

    var table = {
        provider: provider,
        execTime: execTime,
        invocations: {
            gross: calls,
            free: prices[provider].freeCalls,
            net: invocations_net,
            unit: prices[provider].perCall,
            total: invocations_net*prices[provider].perCall
        },
        gb_seconds: {
            gross: (execTime/1000*calls*memory)/1024,
            free: prices[provider].freeGBSec,
            net: gb_seconds_net,
            unit: prices[provider].perGBSec,
            total: gb_seconds_net*prices[provider].perGBSec
        },
        ghz_seconds: {
            gross: ghz_seconds_gross,
            free: prices[provider].freeGHzSec,
            net: ghz_seconds_net,
            unit: prices[provider].perGHzSec,
            total: ghz_seconds_net*prices[provider].perGHzSec
        },
        networking: {
            gross: (calls*kb/1024/1024),
            free: prices[provider].freeGBNetwork, 
            net: networking_net,
            unit: prices[provider].perGBNetwork,
            total: networking_net*prices[provider].perGBNetwork
        },
        total_price: invocations_net*prices[provider].perCall +
                     gb_seconds_net*prices[provider].perGBSec +
                     ghz_seconds_net*prices[provider].perGHzSec +
                     networking_net*prices[provider].perGBNetwork
    }

    return table;
}

/**
 * calculate all prices
 * @param {number} calls - the amount of calls
 * @param {number} execTime - execution time in ms
 * @param {number} kb - the size of the return body in KB
 * @param {number} memory - the amount of memory allocated in MB
 */
function calcAllPrices(calls, execTime, kb, memory) {

    if(!Number.isInteger(calls) || calls < 0) {
        return 'ERROR: variable "calls" must be an integer and greater or equal to 0';
    }
    if(!Number.isInteger(execTime) || execTime < 0) {
        return 'ERROR: variable "execTime" must be an integer and greater or equal to 0';
    }
    if(!Number.isInteger(kb) || kb < 0) {
        return 'ERROR: variable "kb" must be an integer and greater or equal to 0';
    }
    if(!Number.isInteger(memory) || !(memory != 128 || memory != 256 || memory != 512 || memory != 1024 || memory != 2048)) {
        return 'ERROR: variable "memory" must be an integer in [128, 256, 512, 1024, 2048]';
    }

    var result = [];

    var awsTable = calcPrice(calls, execTime, kb, memory, "aws");
    var azureTable = calcPrice(calls, execTime, kb, memory, "azure");
    var googleTable = calcPrice(calls, execTime, kb, memory, "google");
    var ibmTable = calcPrice(calls, execTime, kb, memory, "ibm");

    result.push(awsTable);
    result.push(azureTable);
    result.push(googleTable);
    result.push(ibmTable);

    return result;

}

/**
 * calculate all prices
 * @param {number} calls - the amount of calls
 * @param {string} testName - name of the test
 * @param {string} test - name of the test  type ["factors","custom"]
 * @param {string} runtime - name of runtime ["node","python","go","dotnet"]
 */
async function calcAllPricesFromTest(calls, testName, test, runtime) {

    if(!Number.isInteger(calls) || calls < 0) {
        return 'ERROR: variable "calls" must be an integer and greater or equal to 0';
    }
    if(!(test != "factors" || test != "custom")) {
        return 'ERROR: variable "test" must be a string in [factors","memory","filesystem","custom"]';
    }
    if(!(runtime != "node" || runtime != "python" || runtime != "go" || runtime != "dotnet")) {
        return 'ERROR: variable "runtime" must be a string in ["node","python","go","dotnet"]';
    }

    var execTimeAWS = 0;
    await influx.query(`
        select mean(measured_ms) from ${test}
        where language = '${runtime}'
        and test = '${testName}'
        and provider = 'aws'
    `)
    .then( result => execTimeAWS = result[0].mean )
    .catch( error => execTimeAWS = 0 );

    var execTimeAzure = 0;
    await influx.query(`
        select mean(measured_ms) from ${test}
        where language = '${runtime}'
        and test = '${testName}'
        and provider = 'azure'
    `)
    .then( result => execTimeAzure = result[0].mean )
    .catch( error => execTimeAzure = 0 );

    var execTimeAzureWindows = 0;
    await influx.query(`
        select mean(measured_ms) from ${test}
        where language = '${runtime}'
        and test = '${testName}'
        and provider = 'azureWindows'
    `)
    .then( result => execTimeAzureWindows = result[0].mean )
    .catch( error => execTimeAzureWindows = 0 );

    var execTimeGoogle = 0;
    await influx.query(`
        select mean(measured_ms) from ${test}
        where language = '${runtime}'
        and test = '${testName}'
        and provider = 'google'
    `)
    .then( result => execTimeGoogle = result[0].mean )
    .catch( error => execTimeGoogle = 0 );

    var execTimeIBM = 0;
    await influx.query(`
        select mean(measured_ms) from ${test}
        where language = '${runtime}'
        and test = '${testName}'
        and provider = 'ibm'
    `)
    .then( result => execTimeIBM = result[0].mean )
    .catch( error => execTimeIBM = 0 );

    var memory = 0;
    await influx.query(`
        select first(measured_ms), memory from ${test}
        where language = '${runtime}'
        and test = '${testName}'
    `)
    .then( result => memory = result[0].memory )
    .catch( error => memory = 128 );

    var kb = 1;

    var result = [];

    var awsTable = calcPrice(calls, execTimeAWS, kb, memory, "aws");
    var azureTable = calcPrice(calls, execTimeAzure, kb, memory, "azure");
    var azureWindowsTable = calcPrice(calls, execTimeAzureWindows, kb, memory, "azure");
    var googleTable = calcPrice(calls, execTimeGoogle, kb, memory, "google");
    var ibmTable = calcPrice(calls, execTimeIBM, kb, memory, "ibm");

    result.push(awsTable);
    result.push(azureTable);
    result.push(azureWindowsTable);
    result.push(googleTable);
    result.push(ibmTable);

    return result;

}

module.exports = { calcAllPrices, calcAllPricesFromTest };