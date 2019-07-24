using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace dotnet_memory
{
    public static class memory
    {
        [FunctionName("memory")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {

            int n;
            if(req.Query != null && req.Query.ContainsKey("n")) {
                bool parseOk = Int32.TryParse(req.Query["n"], out n);
                if(!parseOk) {
                    n = 55;
                }
            } else {
                n = 55;
            }

            string instanceId = System.Environment.GetEnvironmentVariable ("WEBSITE_INSTANCE_ID");

            string text = "";

            for(long i = 0; i<n; i++) {
                text += "A";
            }

            return (ActionResult)new OkObjectResult("{ \"payload\": memory test, \"success\": " + true + ", \"n\": " + n + ", \"id\": " + instanceId + ", \"cpu\": '',  \"mem\": '',  \"uptime\": ''}");
        }
    }
}
