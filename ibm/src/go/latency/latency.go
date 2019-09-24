package main

func Main(params map[string]interface{}) map[string]interface{} {

    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "latency test"

    return msg

}