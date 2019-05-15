using System;
using System.Net;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;

namespace Latency
{
    public class LatencyHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            return CreateResponse("Latency Test");
        }

        APIGatewayProxyResponse CreateResponse(String result)
        {
            int statusCode = (int)HttpStatusCode.OK;
            string body = result;

            var response = new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = body,
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
