using System;
using System.IO;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.Json;
using Amazon.Lambda.APIGatewayEvents;
using System.Threading.Tasks;

namespace Factors
{
    public class FactorsHandler
    {
        [LambdaSerializer(typeof(JsonSerializer))]
        public APIGatewayProxyResponse HandleFunction(APIGatewayProxyRequest request, ILambdaContext context)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            long n = 2688834647444046;
		    List<long> list = factorCalc(n);
            sw.Stop();
		    string result = "[";
		    foreach (long i in list)
            {
                result += i + ",";
            }
		    result = result.Remove(result.Length - 1);
		    result += "]";

            return CreateResponse("{ \"n\": " + n + ", \"result\": " + result + ", \"time(ms)\": " + sw.Elapsed.TotalMilliseconds + " }");
        }

        public static List<long> factorCalc(long num) {
          List<long> n_factors = new List<long>();
         
          for (long i = 1; i <= Math.Floor(Math.Sqrt(num)); i ++)
            if (num % i == 0) {
              n_factors.Add(i);
              if (num / i != i) {
                n_factors.Add(num / i);
              }
            }

          n_factors.Sort();

          return n_factors;
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
