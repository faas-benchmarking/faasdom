package function

import (
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
}

func Go_latency(w http.ResponseWriter, r *http.Request) {

        msg := &Message{
                Success: true,
                Payload: Payload{
                    Test: "latency test",
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
