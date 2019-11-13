package function

import (
        "time"
        "fmt"
        "net/http"
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

func Go_custom(w http.ResponseWriter, r *http.Request) {
        start := time.Now()

        /* 
        TODO: put your code here
        You can basically do anything you want,
        but please leave the return statement header
        and the success field as it is.
        */

        elapsed := time.Since(start)
        msg := &Message{
                Success: true,
                Payload: Payload{
                    Test: "custom test",
                    Time: int(elapsed / time.Millisecond),
                },
        }
        
        b, err := json.Marshal(msg)

        if err != nil {
                log.Fatal(err)
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(200)

        fmt.Fprint(w, string(b))
}
