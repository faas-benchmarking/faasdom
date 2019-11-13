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

namespace Matrix
{
    public class MatrixHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            return CreateResponse(request);
        }

        public static int[,] randomTable(int n) {
            Random rnd = new Random();
            int[,] m = new int[n,n];
            for(int i=0;i<n;i++)
            {
                for(int j=0;j<n;j++)
                {
                    Console.WriteLine("i: " + i);
                    Console.WriteLine("j: " + j);
                    m[i, j]= rnd.Next(1, 100);
                }
            }
            Console.WriteLine("ok");
            return m;
        }

        public static int[,] matrix(int n) {
            int[,] matrixA = randomTable(n);
            Console.WriteLine("1st arrray");
            int[,] matrixB = randomTable(n);
            int[,] matrixMult = new int[n, n];
            
            for (int i = 0; i < matrixA.GetLength(0); i++) {
                for (int j = 0; j < matrixB.GetLength(0); j++) {
                    int sum = 0;
                    for (int k = 0; k < matrixA.GetLength(0); k++) {
                        sum += matrixA[i,k] * matrixB[k,j];
                    }
                    matrixMult[i,j] = sum;
                }
            }

            return matrixMult;
        }

        APIGatewayProxyResponse CreateResponse(APIGatewayProxyRequest request)
        {
            int statusCode = (int)HttpStatusCode.OK;

            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            int n = 100;

            if(request.QueryStringParameters != null && request.QueryStringParameters.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(request.QueryStringParameters["n"], out n);
                if(!parseOk) {
                    n = 100;
                }
            } else {
                n = 100;
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
		    int[,] result = matrix(n);
            sw.Stop();

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("matrix test"));
            payload.Add("n", new JValue(n));
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
