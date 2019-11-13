package main

import (
        "time"
        "context"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-lambda-go/events"
        "log"
        "encoding/json"
)

type Message struct {
        Success bool `json:"success"`
        Payload Payload `json:"payload"`
    
}

type Payload struct {
        Test string `json:"test"`
        Time int `json:"time"`
}

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
        start := time.Now()

        /* 
        TODO: put your code here
        You can basically do anything you want,
        but please leave the return statement header
        and the success field as it is.
        */

        elapsed := time.Since(start)
        m := Message{
                Success: true,
                Payload: Payload{
                    Test: "custom test",
                    Time: int(elapsed / time.Millisecond),
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
