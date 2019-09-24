using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;

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
            // TODO: put your code here

            int statusCode = (int)HttpStatusCode.OK;
            var response = new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = "ok"
            };
            
            return response;
        }
    }
}
