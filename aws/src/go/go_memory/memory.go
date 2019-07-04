package main

import (
        "context"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-lambda-go/events"
        "io/ioutil"
        "log"
        "encoding/json"
        "strconv"
)

type Message struct {
        Payload string
        Success string
        InstanceId string
        Cpu string
        Mem string
        Uptime string
}

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

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

        n := event.QueryStringParameters["n"]
        n_num, err := strconv.Atoi(n)
        if err != nil {
                log.Fatal(err)
        }
        
        var text string = ""
        
        for i := 1; i <= n_num; i++ {
                text += "A"
        }

        log.Printf("1")
        
        m := &Message{"memory test", "true", instanceId, cpuinfo, meminfo, uptime}

        log.Printf("2")

        js, err := json.Marshal(m)
        if err != nil {
                log.Fatal(err)
        }

        log.Printf("3")

        return events.APIGatewayProxyResponse{
		Body:       string(js),
		StatusCode: 200,
	}, nil
}

func main() {
        lambda.Start(HandleRequest)
}
