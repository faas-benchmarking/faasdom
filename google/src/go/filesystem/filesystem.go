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
    "math/rand"
)

type Message struct {
    Success bool `json:"success"`
    Payload Payload `json:"payload"`
    Metrics Metrics `json:"metrics"`

}
    
type Payload struct {
    Test string `json:"test"`
    N int `json:"n"`
    Size int `json:"size"`
    TimeWrite string `json:"timewrite"`
    TimeRead string `json:"timeread"`
    Time string `json:"time"`
}

type Metrics struct {
    MachineId string `json:"machineid"`
    InstanceId string `json:"instanceid"`
    Cpu string `json:"cpu"`
    Mem string `json:"mem"`
    Uptime string `json:"uptime"`
}


func Go_filesystem(w http.ResponseWriter, r *http.Request) {

    rnd := rand.Intn(900000) + 100000

    if _, err := os.Stat("/tmp/test"); os.IsNotExist(err) {
        os.Mkdir("/tmp/test", 0777)
    }

    if _, err := os.Stat("/tmp/test/"+strconv.Itoa(rnd)); os.IsNotExist(err) {
        os.Mkdir("/tmp/test/"+strconv.Itoa(rnd), 0777)
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

    log.Print(test)

    files, err := ioutil.ReadDir("/tmp/test/" + strconv.Itoa(rnd))
    if err != nil {
        log.Fatal(err)
    }

    if _, err := os.Stat("/tmp/test/"+strconv.Itoa(rnd)); !os.IsNotExist(err) {
        os.RemoveAll("/tmp/test/"+strconv.Itoa(rnd))
    }

    msg := &Message{
        Success: len(files) == n,
        Payload: Payload{
            Test: "filesystem test",
            N: len(files),
            Size: size,
            TimeWrite: strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10),
            TimeRead: strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10),
            Time: strconv.FormatInt(int64(elapsedWrite / time.Millisecond) + int64(elapsedRead / time.Millisecond), 10),
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