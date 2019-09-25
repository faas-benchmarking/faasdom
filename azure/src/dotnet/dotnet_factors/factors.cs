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

namespace dotnet_factors
{
    public static class factors
    {
        [FunctionName("factors")]
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

            long n = 2688834647444046;

            if(req.Query != null && req.Query.ContainsKey("n")) {
                bool parseOk = Int64.TryParse(req.Query["n"], out n);
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

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
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

    }
}
