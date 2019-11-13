using System;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace Custom
{
    public class CustomDotnet
    {
        public JObject Main(JObject args)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();

            /* 
            TODO: put your code here
            You can basically do anything you want,
            but please leave the return statement header
            and the success field as it is.
            */

            sw.Stop();
            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("custom test"));
            payload.Add("time", new JValue(sw.Elapsed.TotalMilliseconds));
            message.Add("payload", payload);

            return (message);
        }
    }
 }