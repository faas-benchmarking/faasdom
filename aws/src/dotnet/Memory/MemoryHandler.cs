using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Memory
{
    public class MemoryHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            int n;
            if(request.QueryStringParameters != null && request.QueryStringParameters.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(request.QueryStringParameters["n"], out n);
                if(!parseOk) {
                    n = 55;
                }
            } else {
                n = 55;
            }
            
            return CreateResponse("Memory Test", n);
        }

        APIGatewayProxyResponse CreateResponse(String result, int n)
        {
            int statusCode = (int)HttpStatusCode.OK;
            string body = result;

            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            string text = "";

            for(long i = 0; i<n; i++) {
                text += "A";
            }

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("memory test"));
            payload.Add("n", new JValue(n));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machineid", new JValue(""));
            metrics.Add("instanceid", new JValue(instanceId));
            metrics.Add("cpu", new JValue(cpuinfo));
            metrics.Add("mem", new JValue(meminfo));
            metrics.Add("uptime", new JValue(uptime));
            message.Add("metrics", metrics);

            var response = new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = message.ToString(),
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
