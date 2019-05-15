package function

import (
        "fmt"
        "net/http"
)

func Go_latency(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Latency Test")
}
