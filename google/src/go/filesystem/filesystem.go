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
    Payload
    N string
    Success bool
    Cpu string
    Mem string
    Uptime string
}

type Payload struct {
    Test string
    TimeWrite string
    TimeRead string
}

func Go_filesystem(w http.ResponseWriter, r *http.Request) {

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

    log.Print(test)

    files, err := ioutil.ReadDir("/tmp/test")
    if err != nil {
        log.Fatal(err)
    }

    msg := &Message{
        Payload: Payload{
            Test: "filesystem test",
            TimeWrite: strconv.FormatInt(int64(elapsedWrite / time.Millisecond), 10),
            TimeRead: strconv.FormatInt(int64(elapsedRead / time.Millisecond), 10),
        },
        N: strconv.Itoa(len(files)),
        Success: len(files) == 10000,
        Cpu: cpuinfo,
        Mem: meminfo,
        Uptime: uptime,
    }

    b, err := json.Marshal(msg)

    fmt.Fprint(w, string(b))
    

 }