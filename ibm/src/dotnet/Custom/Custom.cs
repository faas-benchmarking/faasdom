using System;
using Newtonsoft.Json.Linq;

namespace Custom
{
    public class CustomDotnet
    {
        public JObject Main(JObject args)
        {
            /* 
            TODO: put your code here
            You can basically do anything you want,
            but please leave the return statement header
            and the success field as it is.
            */

            JObject message = new JObject();
            message.Add("success", new JValue(true));
            JObject payload = new JObject();
            payload.Add("test", new JValue("custom test"));
            message.Add("payload", payload);

            return (message);
        }
    }
 }