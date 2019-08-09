using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace Filesystem
{
    public class FilesystemHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {            
            return CreateResponse(request);
        }

        APIGatewayProxyResponse CreateResponse(APIGatewayProxyRequest request)
        {
            int statusCode = (int)HttpStatusCode.OK;

            if(Directory.Exists("/tmp/test")) {
                System.IO.Directory.Delete("/tmp/test", true);
            }

            if(!Directory.Exists("/tmp/test")) {
                System.IO.Directory.CreateDirectory("/tmp/test");
            }
            
            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            int n = 10000;
            int size = 10240;

            if(request.QueryStringParameters != null && request.QueryStringParameters.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(request.QueryStringParameters["n"], out n);
                if(!parseOk) {
                    n = 10000;
                }
            } else {
                n = 10000;
            }

            if(request.QueryStringParameters != null && request.QueryStringParameters.ContainsKey("size")) {
                bool parseOk = Int32.TryParse(request.QueryStringParameters["size"], out size);
                if(!parseOk) {
                    size = 10240;
                }
            } else {
                size = 10240;
            }

            string text = "";

            for(short i = 0; i<size; i++) {
                text += "A";
            }

            Stopwatch swWrite = new Stopwatch();
            swWrite.Start();
            for(short i = 0; i<n; i++) {
                File.WriteAllText("/tmp/test/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<n; i++) {
                string test = File.ReadAllText("/tmp/test/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test");

            JObject message = new JObject();
            message.Add("success", new JValue((files.Length == n).ToString()));
            JObject payload = new JObject();
            payload.Add("test", new JValue("filesystem test"));
            payload.Add("n", new JValue(files.Length));
            payload.Add("size", new JValue(size));
            payload.Add("timeWrite(ms)", new JValue(swWrite.Elapsed.TotalMilliseconds));
            payload.Add("timeRead(ms)", new JValue(swRead.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machine_id", new JValue(string.Join("\n", "")));
            metrics.Add("instance_id", new JValue(string.Join("\n", instanceId)));
            metrics.Add("cpu", new JValue(string.Join("\n", cpuinfo)));
            metrics.Add("mem", new JValue(string.Join("\n", meminfo)));
            metrics.Add("uptime", new JValue(string.Join("\n", uptime)));
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
