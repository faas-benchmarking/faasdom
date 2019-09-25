using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Factors
{
    public class FactorsDotnet
    {
        public JObject Main(JObject args)
        {
            string machineId = File.ReadAllText("/sys/class/dmi/id/product_uuid");
            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            long n = 2688834647444046;

            if(args["n"] != null) {
                bool parseOk = Int64.TryParse(args["n"].ToString(), out n);
                if(!parseOk) {
                    n = 2688834647444046;
                }
            } else {
                n = 2688834647444046;
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
		        List<long> result = factorCalc(n);
            sw.Stop();
		        
            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("cpu test"));
            payload.Add("n", new JValue(n));
            payload.Add("result", JToken.FromObject(result));
            payload.Add("time", new JValue(sw.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machineid", new JValue(machineId));
            metrics.Add("instanceid", new JValue(instanceId));
            metrics.Add("cpu", new JValue(cpuinfo));
            metrics.Add("mem", new JValue(meminfo));
            metrics.Add("uptime", new JValue(uptime));
            message.Add("metrics", metrics);

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
