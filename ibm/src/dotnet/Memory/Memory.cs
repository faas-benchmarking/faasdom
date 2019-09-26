using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace Memory
{
    public class MemoryDotnet
    {
        public JObject Main(JObject args)
        {

            string machine_id = File.ReadAllText("/sys/class/dmi/id/product_uuid");
            string instance_id = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            int n;
            if(args["n"] != null) {
                bool parseOk = Int32.TryParse(args["n"].ToString(), out n);
                if(!parseOk) {
                    n = 55;
                }
            } else {
                n = 55;
            }

            string text = "";

            for(long i = 0; i<n; i++) {
                text += "A";
            }

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("memory test"));
            payload.Add("n", new JValue(n));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machineid", new JValue(machine_id));
            metrics.Add("instanceid", new JValue(instance_id));
            metrics.Add("cpu", new JValue(cpuinfo));
            metrics.Add("mem", new JValue(meminfo));
            metrics.Add("uptime", new JValue(uptime));
            message.Add("metrics", metrics);

            return (message);
            
        }
    }
 }