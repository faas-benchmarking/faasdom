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

            string path = "";

            if(Directory.Exists("/tmp")) {
                path = "/tmp/test/";
            } else {
                path = "D:\\local\\Temp\\test\\";
            }

            if(Directory.Exists(path)) {
                System.IO.Directory.Delete(path, true);
            }

            if(!Directory.Exists(path)) {
                System.IO.Directory.CreateDirectory(path);
            }

            string instanceId = ""; 
            string cpuinfo = "";
            string meminfo = "";
            string uptime = "";

            if (Directory.Exists("/proc/self/cgroup"))
            {
                instanceId = File.ReadAllText("/proc/self/cgroup");
            }

            if (Directory.Exists("/proc/self/cgroup"))
            {
                cpuinfo = File.ReadAllText("/proc/cpuinfo");
            }

            if (Directory.Exists("/proc/self/cgroup"))
            {
                meminfo = File.ReadAllText("/proc/meminfo");
            }

            if (Directory.Exists("/proc/self/cgroup"))
            {
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
                File.WriteAllText(path+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<n; i++) {
                string test = File.ReadAllText(path+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles(path);

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

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
