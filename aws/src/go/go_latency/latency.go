package main

import (
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
}

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

        m := Message{
                Success: true,
                Payload: Payload{
                    Test: "latency test",
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
