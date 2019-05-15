package main

import (
    "fmt"
    "strings"
    "time"
    "math"
    "sort"
    "strconv"
)

func Main(params map[string]interface{}) map[string]interface{} {

    var n int = 2688834647444046

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)

    msg := make(map[string]interface{})
    msg["n"] = strconv.Itoa(n)
    msg["result"] = "[" + strings.Trim(strings.Join(strings.Fields(fmt.Sprint(result)), ","), "[]") + "]"
    msg["time(ms)"] = strconv.FormatInt(int64(elapsed / time.Millisecond), 10)

    return msg

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
