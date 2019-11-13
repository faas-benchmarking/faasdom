package main

import (
    "time"
)

func Main(params map[string]interface{}) map[string]interface{} {
    start := time.Now()

    /* 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    */

    elapsed := time.Since(start)
    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "custom test"
    msg["payload"].(map[string]interface{})["time"] = int64(elapsed / time.Millisecond)

    return msg
}
