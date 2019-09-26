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

namespace dotnet_custom
{
    public static class custom
    {
        [FunctionName("custom")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {   
            /* 
            TODO: put your code here
            You can basically do anything you want,
            but please leave the return statement header
            and the success field as it is.
            */

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("custom test"));
            message.Add("payload", payload);

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(message.ToString(), Encoding.UTF8, "application/json")
            };
        }
    }
}
