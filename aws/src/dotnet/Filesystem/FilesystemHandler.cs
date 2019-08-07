using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Filesystem
{
    public class FilesystemHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {            
            return CreateResponse();
        }

        APIGatewayProxyResponse CreateResponse()
        {
            int statusCode = (int)HttpStatusCode.OK;

            System.IO.Directory.CreateDirectory("/tmp/test");

            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            string text = "";

            for(short i = 0; i<10240; i++) {
                text += "A";
            }

            Stopwatch swWrite = new Stopwatch();
            swWrite.Start();
            for(short i = 0; i<10000; i++) {
                File.WriteAllText("/tmp/test/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<10000; i++) {
                string test = File.ReadAllText("/tmp/test/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test");

            var response = new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = "{ \"payload\": {\"test\":\"memory test\", \"timeWrite(ms)\": " + swWrite.Elapsed.TotalMilliseconds + ", \"timeRead(ms)\": " + swRead.Elapsed.TotalMilliseconds + ", }, \"success\": " + (files.Length == 10000).ToString() + ", \"n\": " + files.Length + ", \"id\": " + instanceId + ", \"cpu\": " + cpuinfo + ",  \"mem\": " + meminfo + ",  \"uptime\": " + uptime + "}",
                Headers = new Dictionary<string, string>
                { 
                    { "Content-Type", "application/json" }, 
                    { "Access-Control-Allow-Origin", "*" } 
                }
            };
            
            return response;
        }
    }
}
