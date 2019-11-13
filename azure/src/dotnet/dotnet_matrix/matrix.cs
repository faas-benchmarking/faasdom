using System;
using System.Net;
using System.Net.Http;
using System.IO;
using System.Text;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace dotnet_matrix
{
    public static class matrix
    {
        [FunctionName("matrix")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string instanceId = ""; 
            string cpuinfo = "";
            string meminfo = "";
            string uptime = "";

            if (Directory.Exists("/proc"))
            {
                instanceId = File.ReadAllText("/proc/self/cgroup");
                cpuinfo = File.ReadAllText("/proc/cpuinfo");
                meminfo = File.ReadAllText("/proc/meminfo");
                uptime = File.ReadAllText("/proc/uptime");
            }

            int n = 100;

            if(req.Query != null && req.Query.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(req.Query["n"], out n);
                if(!parseOk) {
                    n = 100;
                }
            } else {
                n = 100;
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
		    int[,] result = matrixMult(n);
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

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
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

        public static int[,] matrixMult(int n) {
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

    }
}
