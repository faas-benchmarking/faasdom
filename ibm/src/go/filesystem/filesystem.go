package main

import (
    "strconv"
    "io/ioutil"
    "log"
    "time"
    "os"
)

func Main(params map[string]interface{}) map[string]interface{} {

    if _, err := os.Stat("/tmp/test"); !os.IsNotExist(err) {
        os.RemoveAll("/tmp/test")
        log.Print("DELETED")
    }

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

    n := 10000
    size := 10240

    if _, ok := params["n"]; ok {
        n, err = strconv.Atoi(params["n"].(string))
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 10000
    }

    if _, ok := params["size"]; ok {
        size, err = strconv.Atoi(params["size"].(string))
        if err != nil {
            log.Fatal(err)
        }
    } else {
        size = 10240
    }

    var text string = ""
    
    for i := 0; i < size; i++ {
        text += "A"
    }

    startWrite := time.Now()
    for i := 0; i < n; i++ {
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
    for i := 0; i < n; i++ {
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
    msg["success"] = len(files) == n
    msg["payload"] = map[string]string{}
    msg["payload"].(map[string]string)["Test"] = "filesystem test"
    msg["payload"].(map[string]string)["N"] = strconv.Itoa(len(files))
    msg["payload"].(map[string]string)["Size"] = strconv.Itoa(size)
    msg["payload"].(map[string]string)["TimeWrite"] = strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10)
    msg["payload"].(map[string]string)["TimeRead"] = strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10)
    msg["metrics"] = map[string]string{}
    msg["metrics"].(map[string]string)["machine_id"] = machine_id
    msg["metrics"].(map[string]string)["instance_id"] = instance_id
    msg["metrics"].(map[string]string)["cpu"] = cpuinfo
    msg["metrics"].(map[string]string)["mem"] = meminfo
    msg["metrics"].(map[string]string)["uptime"] = uptime

    return msg

 }