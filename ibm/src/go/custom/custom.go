package main

func Main(params map[string]interface{}) map[string]interface{} {

    /* 
    TODO: put your code here
    You can basically do anything you want,
    but please leave the return statement header
    and the success field as it is.
    */

    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "custom test"

    return msg
}
