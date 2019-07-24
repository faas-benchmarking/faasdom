using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace Memory
{
    public class MemoryDotnet
    {
        public JObject Main(JObject args)
        {

            string[] machine_id = File.ReadAllLines("/sys/class/dmi/id/product_uuid");
            string[] instance_id = File.ReadAllLines("/proc/self/cgroup");
            string[] cpuinfo = File.ReadAllLines("/proc/cpuinfo");
            string[] meminfo = File.ReadAllLines("/proc/meminfo");
            string[] uptime = File.ReadAllLines("/proc/uptime");

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
            message.Add("payload", new JValue("memory test"));
            message.Add("success", new JValue(true));
            message.Add("n", new JValue(n));
            message.Add("instance_id", new JValue(string.Join("\n", instance_id)));
            message.Add("machine_id", new JValue(string.Join("\n", machine_id)));
            message.Add("cpu", new JValue(string.Join("\n", cpuinfo)));
            message.Add("mem", new JValue(string.Join("\n", meminfo)));
            message.Add("uptime", new JValue(string.Join("\n", uptime)));
            return (message);
            
        }
    }
 }