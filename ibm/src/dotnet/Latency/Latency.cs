using System;
using Newtonsoft.Json.Linq;

namespace Latency
{
    public class LatencyDotnet
    {
        public JObject Main(JObject args)
        {
            JObject message = new JObject();
            message.Add("payload", new JValue("Latency Test"));
            return (message);
        }
    }
 }