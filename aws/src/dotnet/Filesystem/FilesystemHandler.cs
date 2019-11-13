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

            Random random = new Random();
            int rnd = random.Next(100000, 1000000);

            if(!Directory.Exists("/tmp/test")) {
                System.IO.Directory.CreateDirectory("/tmp/test");
            }

            if(!Directory.Exists("/tmp/test/" + rnd.ToString())) {
                System.IO.Directory.CreateDirectory("/tmp/test/" + rnd.ToString());
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
                File.WriteAllText("/tmp/test/"+rnd.ToString()+"/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<n; i++) {
                string test = File.ReadAllText("/tmp/test/"+rnd.ToString()+"/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test/"+rnd.ToString());

            if(Directory.Exists("/tmp/test/"+rnd.ToString())) {
                System.IO.Directory.Delete("/tmp/test/"+rnd.ToString(), true);
            }

            JObject message = new JObject();
            message.Add("success", new JValue((files.Length == n)));
            JObject payload = new JObject();
            payload.Add("test", new JValue("filesystem test"));
            payload.Add("n", new JValue(files.Length));
            payload.Add("size", new JValue(size));
            payload.Add("timewrite", new JValue(swWrite.Elapsed.TotalMilliseconds));
            payload.Add("timeread", new JValue(swRead.Elapsed.TotalMilliseconds));
            payload.Add("time", new JValue(swWrite.Elapsed.TotalMilliseconds+swRead.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machineid", new JValue(string.Join("\n", "")));
            metrics.Add("instanceid", new JValue(string.Join("\n", instanceId)));
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
