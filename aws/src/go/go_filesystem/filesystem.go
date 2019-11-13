package main

import (
    "context"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/aws/aws-lambda-go/events"
    "io/ioutil"
    "log"
    "encoding/json"
    "strconv"
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

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

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
    instanceId := string(buf1)

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

    if _, ok := event.QueryStringParameters["n"]; ok {
        n, err = strconv.Atoi(event.QueryStringParameters["n"])
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 10000
    }

    if _, ok := event.QueryStringParameters["size"]; ok {
        size, err = strconv.Atoi(event.QueryStringParameters["size"])
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
        
    m := &Message{
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
            InstanceId: instanceId,
            Cpu: cpuinfo,
            Mem: meminfo,
            Uptime: uptime,
        },
    }

    js, err := json.Marshal(m)
    if err != nil {
            log.Fatal(err)
    }

    return events.APIGatewayProxyResponse{
    Body:       string(js),
    StatusCode: 200,
	}, nil
}

func main() {
    lambda.Start(HandleRequest)
}
