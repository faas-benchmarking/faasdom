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

            System.IO.Directory.CreateDirectory("/tmp/test");
            
            string[] machine_id = File.ReadAllLines("/sys/class/dmi/id/product_uuid");
            string[] instance_id = File.ReadAllLines("/proc/self/cgroup");
            string[] cpuinfo = File.ReadAllLines("/proc/cpuinfo");
            string[] meminfo = File.ReadAllLines("/proc/meminfo");
            string[] uptime = File.ReadAllLines("/proc/uptime");

            string text = "";

            for(short i = 0; i<10240; i++) {
                text += "A";
            }

            Stopwatch swWrite = new Stopwatch();
            swWrite.Start();
            for(short i = 0; i<10000; i++) {
                File.WriteAllText("/tmp/test/"+i+".txt", text);
            }
            swWrite.Stop();

            Stopwatch swRead = new Stopwatch();
            swRead.Start();
            for(short i = 0; i<10000; i++) {
                string test = File.ReadAllText("/tmp/test/"+i+".txt");
            }
            swRead.Stop();

            string[] files = Directory.GetFiles("/tmp/test");

            JObject payload = new JObject();
            payload.Add("test", new JValue("filesystem test"));
            payload.Add("timeWrite(ms)", new JValue(swWrite.Elapsed.TotalMilliseconds));
            payload.Add("timeRead(ms)", new JValue(swRead.Elapsed.TotalMilliseconds));

            JObject message = new JObject();
            message.Add("payload", payload);
            message.Add("success", new JValue((files.Length == 10000).ToString()));
            message.Add("n", new JValue(files.Length));
            message.Add("instance_id", new JValue(string.Join("\n", instance_id)));
            message.Add("machine_id", new JValue(string.Join("\n", machine_id)));
            message.Add("cpu", new JValue(string.Join("\n", cpuinfo)));
            message.Add("mem", new JValue(string.Join("\n", meminfo)));
            message.Add("uptime", new JValue(string.Join("\n", uptime)));
            return (message);
            
        }
    }
 }