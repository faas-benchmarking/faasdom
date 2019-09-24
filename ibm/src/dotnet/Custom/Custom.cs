using System;
using Newtonsoft.Json.Linq;

namespace Custom
{
    public class CustomDotnet
    {
        public JObject Main(JObject args)
        {
            // TODO: put your code here

            JObject message = new JObject();
            message.Add("payload", new JValue("ok"));
            return (message);
        }
    }
 }