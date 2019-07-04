package main

import (
        "context"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-lambda-go/events"
        "io/ioutil"
        "log"
        "encoding/json"
)

type MyEvent struct {
        Name string `json:"name"`
}

type Message struct {
        Payload string
        InstanceId string
        Cpu string
        Mem string
        Uptime string
}

func HandleRequest(ctx context.Context, name MyEvent) (events.APIGatewayProxyResponse, error) {

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

        m := &Message{"Latency Test", instanceId, cpuinfo, meminfo, uptime}
        b, err := json.Marshal(m)
        if err != nil {
                log.Fatal(err)
        }

        return events.APIGatewayProxyResponse{
		Body:       string(b),
		StatusCode: 200,
	}, nil
}

func main() {
        lambda.Start(HandleRequest)
}
