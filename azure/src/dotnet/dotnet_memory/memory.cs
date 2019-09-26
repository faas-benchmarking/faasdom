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

namespace dotnet_memory
{
    public static class memory
    {
        [FunctionName("memory")]
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

            int n;
            if(req.Query != null && req.Query.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(req.Query["n"], out n);
                if(!parseOk) {
                    n = 55;
                }
            } else {
                n = 55;
            }

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

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
