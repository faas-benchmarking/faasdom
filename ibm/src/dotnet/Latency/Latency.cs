using System;
using Newtonsoft.Json.Linq;

namespace Latency
{
    public class LatencyDotnet
    {
        public JObject Main(JObject args)
        {
            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("latency test"));
            message.Add("payload", payload);

            return (message);
        }
    }
 }