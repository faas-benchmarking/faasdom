package function

import (
    "fmt"
    "net/http"
    "strconv"
    "io/ioutil"
    "log"
    "encoding/json"
)

type Message struct {
    Payload string
    N string
    Success bool
    Cpu string
    Mem string
    Uptime string
}

func Go_memory(w http.ResponseWriter, r *http.Request) {

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

    n := r.URL.Query().Get("n")
    if len(n) == 0 {
        n = "55"
    }
    n_num, err := strconv.Atoi(n)

    var text string = ""
    
    for i := 1; i <= n_num; i++ {
        text += "A"
    }

    msg := make(map[string]interface{})
    msg["payload"] = "memory test"
    msg["n"] = strconv.Itoa(n_num)
    msg["success"] = true
    msg["cpu"] = cpuinfo
    msg["mem"] = meminfo
    msg["uptime"] = uptime

    b, err := json.Marshal(msg)

    fmt.Fprint(w, string(b))
    

 }