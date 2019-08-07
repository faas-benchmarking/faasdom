using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Diagnostics;

namespace dotnet_filesystem
{
    public static class filesystem
    {
        [FunctionName("filesystem")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {

            System.IO.Directory.CreateDirectory("/tmp/test");

            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            string text = "";

            for(short i = 0; i<10240; i++) {
                text += "A";
            }

            Stopwatch swWrite = new Stopwatch();
            swWrite.Start();
            for(short i = 0; i<10000; i++) {
                File.WriteAllText("/tmp/test/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<10000; i++) {
                string test = File.ReadAllText("/tmp/test/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test");

            return (ActionResult)new OkObjectResult("{ \"payload\": {\"test\":\"memory test\", \"timeWrite(ms)\": " + swWrite.Elapsed.TotalMilliseconds + ", \"timeRead(ms)\": " + swRead.Elapsed.TotalMilliseconds + ", }, \"success\": " + (files.Length == 10000).ToString() + ", \"n\": " + files.Length + ", \"id\": " + instanceId + ", \"cpu\": " + cpuinfo + ",  \"mem\": " + meminfo + ",  \"uptime\": " + uptime + "}");
        }
    }
}
