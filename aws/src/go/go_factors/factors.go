package main

import (
    "fmt"
    "strings"
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

    var n int = 2688834647444046

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

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)

    m := &Message{"{\"n\":" + strconv.Itoa(n) + ",\"result\": [" + strings.Trim(strings.Join(strings.Fields(fmt.Sprint(result)), ","), "[]") + "],\"time(ms)\": " + strconv.FormatInt(int64(elapsed / time.Millisecond), 10), instanceId, cpuinfo, meminfo, uptime}
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
