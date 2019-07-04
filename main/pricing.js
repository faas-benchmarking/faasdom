// as of 25.06.2019

// in MB resp. MHz (only Google)
const functionSizes = [
    {memory:  128, cpu:  200},
    {memory:  256, cpu:  400},
    {memory:  512, cpu:  800},
    {memory: 1024, cpu: 1400},
    {memory: 2048, cpu: 2400}
];

// AWS
// https://aws.amazon.com/de/lambda/pricing/
// https://aws.amazon.com/de/ec2/pricing/on-demand/

const perCallAWS = 0.0000002;
const perGBSecAWS = 0.0000166667;
const perGBNetworkAWS = 0.09;

const freeCallsAWS = 1000000;
const freeGBSecAWS = 400000;
const freeGBNetworkAWS = 1;

/** TODO */
function calcAWSPrice(calls, execTime, kb, index) {
    
    var billableCalls = calls - freeCallsAWS > 0 ? calls - freeCallsAWS : 0;
    var billableGBSec = (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecAWS > 0 ? (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecAWS : 0;
    var billableGBNetwork = (calls * kb / 1024 / 1024) - freeGBNetworkAWS > 0 ? (calls * kb / 1024 / 1024) - freeGBNetworkAWS : 0;
    var price = (billableCalls * perCallAWS) + (billableGBSec * perGBSecAWS) + (billableGBNetwork * perGBNetworkAWS);

    /*console.log('Invocations: ' + calls + ',\t\t Free: ' + freeCallsAWS + ',\t\t Billed: ' + billableCalls + ',\t\t Cost: ' + (billableCalls * perCallAWS));
    console.log('GB-seconds: ' + (calls * execTime * functionSizes[index].memory) / 1024 + ',\t\t Free: ' + freeGBSecAWS + ',\t\t Billed: ' + billableGBSec + ',\t\t Cost: ' + (billableGBSec * perGBSecAWS));
    console.log('Networking: ' + (calls * kb / 1024 / 1024) + ',\t\t Free: ' + freeGBNetworkAWS + ',\t\t Billed: ' + billableGBNetwork + ',\t\t Cost: ' + (billableGBNetwork * perGBNetworkAWS));
    console.log('Price: ' + Math.round(price * 100) / 100 + '$');
    */

    return price;
}


// Azure
// https://azure.microsoft.com/en-us/pricing/details/functions/
// https://azure.microsoft.com/en-us/pricing/details/bandwidth/
// https://azure.microsoft.com/en-us/pricing/details/storage/files/     INFO: Storage price not included, since it should be practically nothing < 0.10 $

const perCallAzure = 0.0000002;
const perGBSecAzure = 0.000016;
const perGBNetworkAzure = 0.087;

const freeCallAzure = 1000000;
const freeGBSecAzure = 400000;
const freeGBNetworkAzure = 5;

/** TODO */
function calcAzurePrice(calls, execTime, kb, index) {
    
    var billableCalls = calls - freeCallAzure > 0 ? calls - freeCallAzure : 0;
    var billableGBSec = (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecAzure > 0 ? (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecAzure : 0;
    var billableGBNetwork = (calls * kb / 1024 / 1024) - perGBNetworkAzure > 0 ? (calls * kb / 1024 / 1024) - perGBNetworkAzure : 0;
    var price = (billableCalls * perCallAzure) + (billableGBSec * perGBSecAzure) + (billableGBNetwork * perGBNetworkAzure);

    /*console.log('Invocations: ' + calls + ',\t\t Free: ' + freeCallAzure + ',\t\t Billed: ' + billableCalls + ',\t\t Cost: ' + (billableCalls * perCallAzure));
    console.log('GB-seconds: ' + (calls * execTime * functionSizes[index].memory) / 1024 + ',\t\t Free: ' + freeGBSecAzure + ',\t\t Billed: ' + billableGBSec + ',\t\t Cost: ' + (billableGBSec * perGBSecAzure));
    console.log('Networking: ' + (calls * kb / 1024 / 1024) + ',\t\t Free: ' + freeGBNetworkAzure + ',\t\t Billed: ' + billableGBNetwork + ',\t\t Cost: ' + (billableGBNetwork * perGBNetworkAzure));
    console.log('Price: ' + Math.round(price * 100) / 100 + '$');
    */

    return price;
}


// Google
// https://cloud.google.com/functions/pricing#invocations
// https://cloud.google.com/functions/pricing-summary

const perCallGoogle = 0.0000004;
const perGBSecGoogle = 0.0000025;
const perGHzSecGoogle = 0.0000100;
const perGBNetworkGoogle = 0.12;

const freeCallsGoogle = 2000000;
const freeGBSecGoogle = 400000;
const freeGHzSecGoogle = 200000;
const freeGBNetworkGoogle = 5;

/** TODO */
function calcGooglePrice(calls, execTime, kb, index) {
    
    var billableCalls = calls - freeCallsGoogle > 0 ? calls - freeCallsGoogle : 0;
    var billableGBSec = (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecGoogle > 0 ? (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecGoogle : 0;
    var billableGHzSec = (calls * execTime * functionSizes[index].cpu) / 1000 - freeGHzSecGoogle > 0 ? (calls * execTime * functionSizes[index].cpu) / 1000 - freeGHzSecGoogle : 0;
    var billableGBNetwork = (calls * kb / 1024 / 1024) - freeGBNetworkGoogle > 0 ? (calls * kb / 1024 / 1024) - freeGBNetworkGoogle : 0;
    var price = (billableCalls * perCallGoogle) + (billableGBSec * perGBSecGoogle) + (billableGHzSec * perGHzSecGoogle) + (billableGBNetwork * perGBNetworkGoogle);

    /*
    console.log('Invocations: ' + calls + ',\t\t Free: ' + freeCallsGoogle + ',\t\t Billed: ' + billableCalls + ',\t\t Cost: ' + (billableCalls * perCallGoogle));
    console.log('GB-seconds: ' + (calls * execTime * functionSizes[index].memory) / 1024 + ',\t\t Free: ' + freeGBSecGoogle + ',\t\t Billed: ' + billableGBSec + ',\t\t Cost: ' + (billableGBSec * perGBSecGoogle));
    console.log('GHz-seconds: ' + (calls * execTime * functionSizes[index].cpu) / 1000 + ',\t\t Free: ' + freeGHzSecGoogle + ',\t\t Billed: ' + billableGHzSec + ',\t\t Cost: ' + (billableGHzSec * perGHzSecGoogle));
    console.log('Networking: ' + (calls * kb / 1024 / 1024) + ',\t\t Free: ' + freeGBNetworkGoogle + ',\t\t Billed: ' + billableGBNetwork + ',\t\t Cost: ' + (billableGBNetwork * perGBNetworkGoogle));
    console.log('Price: ' + Math.round(price * 100) / 100 + '$');
    */

    return price;
}


// IBM
// https://cloud.ibm.com/openwhisk/learn/pricing

const perGBSecIBM = 0.000017;

const freeGBSecIBM = 400000;

/** TODO */
function calcIBMPrice(calls, execTime, kb, index) {
    
    var billableGBSec = (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecIBM > 0 ? (calls * execTime * functionSizes[index].memory) / 1024 - freeGBSecIBM : 0;
    var price = (billableGBSec * perGBSecIBM);

    /*console.log('Invocations: ' + calls);
    console.log('GB-seconds: ' + (calls * execTime * functionSizes[index].memory) / 1024 + ',\t\t Free: ' + freeGBSecIBM + ',\t\t Billed: ' + billableGBSec + ',\t\t Cost: ' + (billableGBSec * perGBSecIBM));
    console.log('Price: ' + Math.round(price * 100) / 100 + '$');
    */
   
    return price;
}


module.exports = { calcAWSPrice, calcAzurePrice, calcGooglePrice, calcIBMPrice };




/*var type = 1;
var calls = 10000000;
var runtime = 0.5;
var kb = 5;

console.log('AWS');
console.log('===')
calcAWSPrice(calls, runtime, kb, type);
console.log('');

console.log('Azure');
console.log('=====')
calcAzurePrice(calls, runtime, kb, type);
console.log('');

console.log('Google');
console.log('======')
calcGooglePrice(calls, runtime, kb, type);
console.log('');

console.log('IBM');
console.log('===')
calcIBMPrice(calls, runtime, kb, type);
console.log('');*/