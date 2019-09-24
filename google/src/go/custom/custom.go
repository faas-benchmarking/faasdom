package function

import (
        "fmt"
        "net/http"
)

func Go_custom(w http.ResponseWriter, r *http.Request) {

        // TODO: put your code here

        fmt.Fprint(w, "ok")
}
