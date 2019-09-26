package main

import (
    "io/ioutil"
    "log"
    "strconv"
)

type Message struct {
    Payload string
    Success bool
    Instance_id string
    Machine_id string
    Cpu string
    Mem string
    Uptime string
}

func Main(params map[string]interface{}) map[string]interface{} {

    buf1, err := ioutil.ReadFile("/proc/self/cgroup")
	if err != nil {
		log.Fatal(err)
    }
    instance_id := string(buf1)

    buf2, err := ioutil.ReadFile("/proc/cpuinfo")
	if err != nil {
		log.Fatal(err)
    }
    cpuinfo := string(buf2)

    buf3, err := ioutil.ReadFile("/proc/meminfo")
	if err != nil {
		log.Fatal(err)
    }
    meminfo := string(buf3)

    buf4, err := ioutil.ReadFile("/proc/uptime")
	if err != nil {
		log.Fatal(err)
    }
    uptime := string(buf4)

    buf5, err := ioutil.ReadFile("/sys/class/dmi/id/product_uuid")
	if err != nil {
		log.Fatal(err)
    }
    machine_id := string(buf5)

    n := 55

    if _, ok := params["n"]; ok {
        n, err = strconv.Atoi(params["n"].(string))
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 55
    }

    var text string = ""
    
    for i := 1; i <= n; i++ {
        text += "A"
    }

    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "memory test"
    msg["payload"].(map[string]interface{})["n"] = n
    msg["metrics"] = map[string]string{}
    msg["metrics"].(map[string]string)["machineid"] = machine_id
    msg["metrics"].(map[string]string)["instanceid"] = instance_id
    msg["metrics"].(map[string]string)["cpu"] = cpuinfo
    msg["metrics"].(map[string]string)["mem"] = meminfo
    msg["metrics"].(map[string]string)["uptime"] = uptime

    return msg

 }