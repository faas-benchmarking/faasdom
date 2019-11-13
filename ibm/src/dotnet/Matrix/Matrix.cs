using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Matrix
{
    public class MatrixDotnet
    {
        public JObject Main(JObject args)
        {
            string machineId = File.ReadAllText("/sys/class/dmi/id/product_uuid");
            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            int n = 100;

            if(args["n"] != null) {
                bool parseOk = Int32.TryParse(args["n"].ToString(), out n);
                if(!parseOk) {
                    n = 100;
                }
            } else {
                n = 100;
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
		        int[,] result = matrixCalc(n);
            sw.Stop();
		        
            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("matrix test"));
            payload.Add("n", new JValue(n));
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

        public static int[,] randomTable(int n) {
            Random rnd = new Random();
            int[,] m = new int[n,n];
            for(int i=0;i<n;i++)
            {
                for(int j=0;j<n;j++)
                {
                    Console.WriteLine("i: " + i);
                    Console.WriteLine("j: " + j);
                    m[i, j]= rnd.Next(1, 100);
                }
            }
            Console.WriteLine("ok");
            return m;
        }

        public static int[,] matrixCalc(int n) {
            int[,] matrixA = randomTable(n);
            Console.WriteLine("1st arrray");
            int[,] matrixB = randomTable(n);
            int[,] matrixMult = new int[n, n];
            
            for (int i = 0; i < matrixA.GetLength(0); i++) {
                for (int j = 0; j < matrixB.GetLength(0); j++) {
                    int sum = 0;
                    for (int k = 0; k < matrixA.GetLength(0); k++) {
                        sum += matrixA[i,k] * matrixB[k,j];
                    }
                    matrixMult[i,j] = sum;
                }
            }

            return matrixMult;
        }
    }
}
