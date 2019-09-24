package main

import (
        "context"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-lambda-go/events"
)

type MyEvent struct {
        Test string
}

func HandleRequest(ctx context.Context, test MyEvent) (events.APIGatewayProxyResponse, error) {

        // TODO: put your code here

        return events.APIGatewayProxyResponse{
		Body:       "ok",
		StatusCode: 200,
	}, nil
}

func main() {
        lambda.Start(HandleRequest)
}
