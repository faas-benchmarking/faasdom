package main

import (
    "time"
    "math/rand"
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

    n := 100

    if _, ok := event.QueryStringParameters["n"]; ok {
        n, err = strconv.Atoi(event.QueryStringParameters["n"])
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 100
    }

    start := time.Now()
    matrix(n)
    elapsed := time.Since(start)

    m := Message{
        Success: true,
        Payload: Payload{
            Test: "matrix test",
            N: n,
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
	
func randomTable(n int) [][]int {

    s1 := rand.NewSource(time.Now().UnixNano())
    r1 := rand.New(s1)

    m := make([][]int, n) 
    for i:=0; i<n; i++ {
        m[i] = make([]int, n)
        for j:=0; j<n; j++ {
            m[i][j] = r1.Intn(100)
        }
    }
    return m
}

func matrix(n int) [][]int {
    matrixA := randomTable(n)
    matrixB := randomTable(n)
    matrixMult := make([][]int, n)
 
    for i := 0; i < len(matrixA); i++ {
        matrixMult[i] = make([]int, n)
        for j := 0; j < len(matrixB); j++ {
            sum := 0
            for k := 0; k < len(matrixA); k++ {
                sum += matrixA[i][k] * matrixB[k][j]
            }
            matrixMult[i][j] = sum
        }
    }

    return matrixMult
}