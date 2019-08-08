package function

import (
    "fmt"
    "net/http"
    "strconv"
    "io/ioutil"
    "log"
    "encoding/json"
    "time"
    "os"
)

type Message struct {
    Success bool
    Payload Payload
    Metrics Metrics

}
    
type Payload struct {
    Test string
    N int
    Size int
    TimeWrite string
    TimeRead string
}

type Metrics struct {
    MachineId string
    InstanceId string
    Cpu string
    Mem string
    Uptime string
}


func Go_filesystem(w http.ResponseWriter, r *http.Request) {

    if _, err := os.Stat("/tmp/test"); !os.IsNotExist(err) {
        os.RemoveAll("/tmp/test")
    }

    if _, err := os.Stat("/tmp/test"); os.IsNotExist(err) {
        os.Mkdir("/tmp/test", os.ModeDir)
    }

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

    n := 10000
    size := 10240

    if r.URL.Query().Get("n") != "" {
        n, err = strconv.Atoi(r.URL.Query().Get("n"))
        if err != nil {
                log.Fatal(err)
        }
    } else {
        n = 10000
    }

    if r.URL.Query().Get("size") != "" {
        size, err = strconv.Atoi(r.URL.Query().Get("size"))
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

    log.Print(test)

    files, err := ioutil.ReadDir("/tmp/test")
    if err != nil {
        log.Fatal(err)
    }

    msg := &Message{
        Success: len(files) == 10000,
        Payload: Payload{
            Test: "filesystem test",
            N: len(files),
            Size: size,
            TimeWrite: strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10),
            TimeRead: strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10),
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