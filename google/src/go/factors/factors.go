package function

import (
    "fmt"
    "net/http"
    "strings"
    "time"
    "math"
    "sort"
    "strconv"
)

func Go_factors(w http.ResponseWriter, r *http.Request) {

    var n int = 2688834647444046

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)

    fmt.Fprint(w, "{\"n\":" + strconv.Itoa(n) + ",\"result\": [" + strings.Trim(strings.Join(strings.Fields(fmt.Sprint(result)), ","), "[]") + "],\"time(ms)\": " + strconv.FormatInt(int64(elapsed / time.Millisecond), 10))
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
