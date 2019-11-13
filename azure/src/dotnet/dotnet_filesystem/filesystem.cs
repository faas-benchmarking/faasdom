using System;
using System.Net;
using System.Net.Http;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace dotnet_filesystem
{
    public static class filesystem
    {
        [FunctionName("filesystem")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            Random random = new Random();
            int rnd = random.Next(100000, 1000000);

            string path = "";
            string fullPath = "";

            if(Directory.Exists("/tmp")) {
                path = "/tmp/test/";
                fullPath = "/tmp/test/" + rnd.ToString() + "/";
            } else {
                path = "D:\\local\\Temp\\test\\";
                fullPath = "D:\\local\\Temp\\test\\" + rnd.ToString() + "\\";
            }

            if(!Directory.Exists(path)) {
                System.IO.Directory.CreateDirectory(path);
            }

            if(!Directory.Exists(fullPath)) {
                System.IO.Directory.CreateDirectory(fullPath);
            }

            string instanceId = ""; 
            string cpuinfo = "";
            string meminfo = "";
            string uptime = "";

            if (Directory.Exists("/proc/"))
            {
                instanceId = File.ReadAllText("/proc/self/cgroup");
                cpuinfo = File.ReadAllText("/proc/cpuinfo");
                meminfo = File.ReadAllText("/proc/meminfo");
                uptime = File.ReadAllText("/proc/uptime");
            }

            int n = 10000;
            int size = 10240;

            if(req.Query != null && req.Query.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(req.Query["n"], out n);
                if(!parseOk) {
                    n = 10000;
                }
            } else {
                n = 10000;
            }

            if(req.Query != null && req.Query.ContainsKey("size")) {
                bool parseOk = Int32.TryParse(req.Query["size"], out size);
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
                File.WriteAllText(fullPath+""+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<n; i++) {
                string test = File.ReadAllText(fullPath+""+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles(fullPath);

            if(Directory.Exists(fullPath)) {
                System.IO.Directory.Delete(fullPath, true);
            }

            JObject message = new JObject();
            message.Add("success", new JValue(files.Length == n));
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

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
