using System;
using System.Diagnostics;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Factors
{
    public class FactorsDotnet
    {
        public JObject Main(JObject args)
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

            JObject message = new JObject();
            message.Add("n", new JValue(n));
            message.Add("result", new JValue(result));
            message.Add("time(ms)", new JValue(sw.Elapsed.TotalMilliseconds));
            return (message);
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
