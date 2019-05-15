using System;
using System.IO;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace dotnet_factors
{
    public static class factors
    {
        [FunctionName("factors")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
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

            return (ActionResult)new OkObjectResult("{ \"n\": " + n + ", \"result\": " + result + ", 'time(ms)': " + sw.Elapsed.TotalMilliseconds + " }");
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

    }
}
