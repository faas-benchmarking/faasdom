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
    Success bool `json:"success"`
    Payload Payload `json:"payload"`
    Metrics Metrics `json:"metrics"`

}
    
type Payload struct {
    Test string `json:"test"`
    N int `json:"n"`
}

type Metrics struct {
    MachineId string `json:"machineid"`
    InstanceId string `json:"instanceid"`
    Cpu string `json:"cpu"`
    Mem string `json:"mem"`
    Uptime string `json:"uptime"`
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

    msg := &Message{
        Success: true,
        Payload: Payload{
            Test: "memory test",
            N: n_num,
        },
        Metrics: Metrics{
            MachineId: "",
            InstanceId: "",
            Cpu: cpuinfo,
            Mem: meminfo,
            Uptime: uptime,
        },
    }

    b, err := json.Marshal(msg)

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)

    fmt.Fprint(w, string(b))

 }