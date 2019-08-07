package main

import (
    "strconv"
    "io/ioutil"
    "log"
    "time"
    "os"
)

func Main(params map[string]interface{}) map[string]interface{} {

    if _, err := os.Stat("/tmp/test"); os.IsNotExist(err) {
        os.Mkdir("/tmp/test", 0777)
    }

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

    var text string = ""
    
    for i := 0; i < 10240; i++ {
        text += "A"
    }

    startWrite := time.Now()
    for i := 0; i < 10000; i++ {
        f, err := os.Create("/tmp/test/" + strconv.Itoa(i) + ".txt")
        if err != nil {
            log.Fatal(err)
        }
        f.WriteString(text)
        f.Close()
    }
    elapsedWrite := time.Since(startWrite)
    
    var test string = ""

    startRead := time.Now()
    for i := 0; i < 10000; i++ {
        buf, err := ioutil.ReadFile("/tmp/test/" + strconv.Itoa(i) + ".txt")
	    if err != nil {
		    log.Fatal(err)
        }
        test = string(buf)
    }
    elapsedRead := time.Since(startRead)

    log.Print(test, elapsedWrite, elapsedRead)

    files, err := ioutil.ReadDir("/tmp/test")
    if err != nil {
        log.Fatal(err)
    }

    msg := map[string]interface{}{}
    msg["payload"] = map[string]string{}
    msg["payload"].(map[string]string)["Test"] = "filesystem test"
    msg["payload"].(map[string]string)["Test"] = "filesystem test"
    msg["payload"].(map[string]string)["TimeWrite"] = strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10)
    msg["payload"].(map[string]string)["TimeRead"] = strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10)
    msg["n"] = strconv.Itoa(len(files))
    msg["success"] = len(files) == 10000
    msg["instance_id"] = instance_id
    msg["machine_id"] = machine_id
    msg["cpu"] = cpuinfo
    msg["mem"] = meminfo
    msg["uptime"] = uptime

    return msg

 }