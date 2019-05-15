package main

import (
        "context"
        "github.com/aws/aws-lambda-go/lambda"
	    "github.com/aws/aws-lambda-go/events"
)

type MyEvent struct {
        Name string `json:"name"`
}

func HandleRequest(ctx context.Context, name MyEvent) (events.APIGatewayProxyResponse, error) {
        return events.APIGatewayProxyResponse{
		Body:       "Latency Test",
		StatusCode: 200,
	}, nil
}

func main() {
        lambda.Start(HandleRequest)
}
