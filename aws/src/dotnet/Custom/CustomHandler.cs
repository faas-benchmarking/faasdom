using System;
using System.Net;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Custom
{
    public class CustomHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            return CreateResponse();
        }

        APIGatewayProxyResponse CreateResponse()
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();

            /* 
            TODO: put your code here
            You can basically do anything you want,
            but please leave the return statement header
            and the success field as it is.
            */

            sw.Stop();
            int statusCode = (int)HttpStatusCode.OK;

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("custom test"));
            payload.Add("time", new JValue(sw.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);

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
