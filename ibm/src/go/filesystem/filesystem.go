package main

import (
    "strconv"
    "io/ioutil"
    "log"
    "time"
    "os"
    "math/rand"
)

func Main(params map[string]interface{}) map[string]interface{} {

    rnd := rand.Intn(900000) + 100000

    if _, err := os.Stat("/tmp/test"); os.IsNotExist(err) {
        os.Mkdir("/tmp/test", 0777)
    }

    if _, err := os.Stat("/tmp/test/"+strconv.Itoa(rnd)); os.IsNotExist(err) {
        os.Mkdir("/tmp/test/"+strconv.Itoa(rnd), 0777)
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
        f, err := os.Create("/tmp/test/" + strconv.Itoa(rnd) + "/" + strconv.Itoa(i) + ".txt")
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
        buf, err := ioutil.ReadFile("/tmp/test/" + strconv.Itoa(rnd) + "/" + strconv.Itoa(i) + ".txt")
	    if err != nil {
		    log.Fatal(err)
        }
        test = string(buf)
    }
    elapsedRead := time.Since(startRead)

    log.Print(test, elapsedWrite, elapsedRead)

    files, err := ioutil.ReadDir("/tmp/test/" + strconv.Itoa(rnd))
    if err != nil {
        log.Fatal(err)
    }

    if _, err := os.Stat("/tmp/test/"+strconv.Itoa(rnd)); !os.IsNotExist(err) {
        os.RemoveAll("/tmp/test/"+strconv.Itoa(rnd))
    }

    msg := map[string]interface{}{}
    msg["success"] = len(files) == n
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "filesystem test"
    msg["payload"].(map[string]interface{})["n"] = len(files)
    msg["payload"].(map[string]interface{})["size"] = size
    msg["payload"].(map[string]interface{})["timewrite"] = strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10)
    msg["payload"].(map[string]interface{})["timeread"] = strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10)
    msg["payload"].(map[string]interface{})["time"] = strconv.FormatInt(int64(elapsedWrite / time.Millisecond) + int64(elapsedRead / time.Millisecond), 10)
    msg["metrics"] = map[string]string{}
    msg["metrics"].(map[string]string)["machineid"] = machine_id
    msg["metrics"].(map[string]string)["instanceid"] = instance_id
    msg["metrics"].(map[string]string)["cpu"] = cpuinfo
    msg["metrics"].(map[string]string)["mem"] = meminfo
    msg["metrics"].(map[string]string)["uptime"] = uptime

    return msg

 }