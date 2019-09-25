package main

import (
    "time"
    "math"
    "sort"
    "strconv"
    "io/ioutil"
    "log"
)

func Main(params map[string]interface{}) map[string]interface{} {

    buf1, err := ioutil.ReadFile("/proc/self/cgroup")
	if err != nil {
		log.Fatal(err)
    }
    instance_id := string(buf1)

    buf2, err := ioutil.ReadFile("/proc/cpuinfo")
	if err != nil {
		log.Fatal(err)
    }
    cpuinfo := string(buf2)

    buf3, err := ioutil.ReadFile("/proc/meminfo")
	if err != nil {
		log.Fatal(err)
    }
    meminfo := string(buf3)

    buf4, err := ioutil.ReadFile("/proc/uptime")
	if err != nil {
		log.Fatal(err)
    }
    uptime := string(buf4)

    buf5, err := ioutil.ReadFile("/sys/class/dmi/id/product_uuid")
	if err != nil {
		log.Fatal(err)
    }
    machine_id := string(buf5)

    n := 2688834647444046

    if _, ok := params["n"]; ok {
        n, err = strconv.Atoi(params["n"].(string))
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 2688834647444046
    }

    start := time.Now()
    var result []int = factors(n)
    elapsed := time.Since(start)
    
    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "cpu test"
    msg["payload"].(map[string]interface{})["n"] = n
    msg["payload"].(map[string]interface{})["result"] = result
    msg["payload"].(map[string]interface{})["time"] = int64(elapsed / time.Millisecond)
    msg["metrics"] = map[string]string{}
    msg["metrics"].(map[string]string)["machineid"] = machine_id
    msg["metrics"].(map[string]string)["instanceid"] = instance_id
    msg["metrics"].(map[string]string)["cpu"] = cpuinfo
    msg["metrics"].(map[string]string)["mem"] = meminfo
    msg["metrics"].(map[string]string)["uptime"] = uptime

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
