using System;
using System.IO;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace Filesystem
{
    public class FilesystemDotnet
    {
        public JObject Main(JObject args)
        {
            Random random = new Random();
            int rnd = random.Next(100000, 1000000);

            if(!Directory.Exists("/tmp/test")) {
                System.IO.Directory.CreateDirectory("/tmp/test");
            }

            if(!Directory.Exists("/tmp/test/" + rnd.ToString())) {
                System.IO.Directory.CreateDirectory("/tmp/test/" + rnd.ToString());
            }
            
            string machineId = File.ReadAllText("/sys/class/dmi/id/product_uuid");
            string instanceId = File.ReadAllText("/proc/self/cgroup");
            string cpuinfo = File.ReadAllText("/proc/cpuinfo");
            string meminfo = File.ReadAllText("/proc/meminfo");
            string uptime = File.ReadAllText("/proc/uptime");

            int n = 10000;
            int size = 10240;

            if(args["n"] != null) {
                bool parseOk = Int32.TryParse(args["n"].ToString(), out n);
                if(!parseOk) {
                    n = 10000;
                }
            } else {
                n = 10000;
            }

            if(args["size"] != null) {
                bool parseOk = Int32.TryParse(args["size"].ToString(), out size);
                if(!parseOk) {
                    size = 10240;
                }
            } else {
                size = 10240;
            }

            string text = "";

            for(short i = 0; i<size; i++) {
                text += "A";
            }

            Stopwatch swWrite = new Stopwatch();
            swWrite.Start();
            for(short i = 0; i<n; i++) {
                File.WriteAllText("/tmp/test/"+rnd.ToString()+"/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<n; i++) {
                string test = File.ReadAllText("/tmp/test/"+rnd.ToString()+"/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test/"+rnd.ToString());

            if(Directory.Exists("/tmp/test/"+rnd.ToString())) {
                System.IO.Directory.Delete("/tmp/test/"+rnd.ToString(), true);
            }

            JObject message = new JObject();
            message.Add("success", new JValue((files.Length == n)));
            JObject payload = new JObject();
            payload.Add("test", new JValue("filesystem test"));
            payload.Add("n", new JValue(files.Length));
            payload.Add("size", new JValue(size));
            payload.Add("timewrite", new JValue(swWrite.Elapsed.TotalMilliseconds));
            payload.Add("timeread", new JValue(swRead.Elapsed.TotalMilliseconds));
            payload.Add("time", new JValue(swWrite.Elapsed.TotalMilliseconds+swRead.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);
            JObject metrics = new JObject();
            metrics.Add("machineid", new JValue(string.Join("\n", machineId)));
            metrics.Add("instanceid", new JValue(string.Join("\n", instanceId)));
            metrics.Add("cpu", new JValue(string.Join("\n", cpuinfo)));
            metrics.Add("mem", new JValue(string.Join("\n", meminfo)));
            metrics.Add("uptime", new JValue(string.Join("\n", uptime)));
            message.Add("metrics", metrics);

            return (message);
            
        }
    }
 }