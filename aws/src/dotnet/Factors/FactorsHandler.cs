using System;
using System.IO;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using Newtonsoft.Json.Linq;

namespace Factors
{
    public class FactorsHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            return CreateResponse(request);
        }

        public static List<long> factorCalc(long num) {
          List<long> n_factors = new List<long>();
         
          for (long i = 1; i <= Math.Floor(Math.Sqrt(num)); i ++)
            if (num % i == 0) {
              n_factors.Add(i);
              if (num / i != i) {
                n_factors.Add(num / i);
              }
            }

          n_factors.Sort();

          return n_factors;
        }

        APIGatewayProxyResponse CreateResponse(APIGatewayProxyRequest request)
        {
            int statusCode = (int)HttpStatusCode.OK;

            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            long n = 2688834647444046;

            if(request.QueryStringParameters != null && request.QueryStringParameters.ContainsKey("n")) {
                bool parseOk = Int64.TryParse(request.QueryStringParameters["n"], out n);
                if(!parseOk) {
                    n = 2688834647444046;
                }
            } else {
                n = 2688834647444046;
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
		        List<long> result = factorCalc(n);
            sw.Stop();

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("cpu test"));
            payload.Add("n", new JValue(n));
            payload.Add("result", JToken.FromObject(result));
            payload.Add("time", new JValue(sw.Elapsed.TotalMilliseconds));
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
