package main

func Main(params map[string]interface{}) map[string]interface{} {
    msg := make(map[string]interface{})
    msg["payload"] = "Latency Test"
    return msg
}