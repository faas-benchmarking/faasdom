package main

import (
    "strconv"
    "io/ioutil"
    "log"
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

    n, ok := params["n"].(int)
    if !ok {
        n = 55
    }

    var text string = ""
    
    for i := 1; i <= n; i++ {
        text += "A"
    }

    msg := make(map[string]interface{})
    msg["payload"] = "memory test"
    msg["n"] = strconv.Itoa(n)
    msg["success"] = "true"
    msg["instance_id"] = instance_id
    msg["machine_id"] = machine_id
    msg["cpu"] = cpuinfo
    msg["mem"] = meminfo
    msg["uptime"] = uptime

    return msg

 }