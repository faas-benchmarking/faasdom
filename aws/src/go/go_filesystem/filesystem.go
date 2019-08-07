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
)

type Message struct {
        Payload
        N string
        Success bool
        Cpu string
        Mem string
        Uptime string
        InstanceId string
    }
    
    type Payload struct {
        Test string
        TimeWrite string
        TimeRead string
    }

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

        if _, err := os.Stat("/tmp/test"); os.IsNotExist(err) {
                os.Mkdir("/tmp/test", 0777)
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
        
        m := &Message{
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
                InstanceId: instanceId,
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
