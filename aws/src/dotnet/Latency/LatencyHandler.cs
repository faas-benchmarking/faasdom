using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Latency
{
    public class LatencyHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            return CreateResponse();
        }

        APIGatewayProxyResponse CreateResponse()
        {
            int statusCode = (int)HttpStatusCode.OK;

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("latency test"));
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
