package main

import (
    "time"
    "math"
    "sort"
    "strconv"
    "context"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/aws/aws-lambda-go/events"
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
    Result []int `json:"result"`
    Time int `json:"time"`
}

type Metrics struct {
    MachineId string `json:"machineid"`
    InstanceId string `json:"instanceid"`
    Cpu string `json:"cpu"`
    Mem string `json:"mem"`
    Uptime string `json:"uptime"`
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

    n := 2688834647444046

    if _, ok := event.QueryStringParameters["n"]; ok {
        n, err = strconv.Atoi(event.QueryStringParameters["n"])
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 2688834647444046
    }

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)

    m := Message{
        Success: true,
        Payload: Payload{
            Test: "cpu test",
            N: n,
            Result: result,
            Time: int(elapsed / time.Millisecond),
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
	
func factors(num int) []int {

    var n_factors = make([]int, 0)

    for i := 1; i <= int(math.Floor(math.Sqrt(float64(num)))); i++ {
        if num % i == 0 {
            n_factors = append(n_factors, i)
            if num / i != i {
                n_factors = append(n_factors, num / i)
            }
        }
    }

    sort.Ints(n_factors)

    return n_factors

}
