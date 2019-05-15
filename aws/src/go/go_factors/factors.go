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
)

type MyEvent struct {
    Name string `json:"name"`
}

func HandleRequest(ctx context.Context, name MyEvent) (events.APIGatewayProxyResponse, error) {

    var n int = 2688834647444046

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)

    return events.APIGatewayProxyResponse{
        Body:       "{\"n\":" + strconv.Itoa(n) + ",\"result\": [" + strings.Trim(strings.Join(strings.Fields(fmt.Sprint(result)), ","), "[]") + "],\"time(ms)\": " + strconv.FormatInt(int64(elapsed / time.Millisecond), 10),
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
