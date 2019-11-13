package main

import (
    "time"
    "math/rand"
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

    n := 100

    if _, ok := params["n"]; ok {
        n, err = strconv.Atoi(params["n"].(string))
        if err != nil {
            log.Fatal(err)
        }
    } else {
        n = 100
    }

    start := time.Now()
    matrix(n)
    elapsed := time.Since(start)
    
    msg := map[string]interface{}{}
    msg["success"] = true
    msg["payload"] = map[string]interface{}{}
    msg["payload"].(map[string]interface{})["test"] = "matrix test"
    msg["payload"].(map[string]interface{})["n"] = n
    msg["payload"].(map[string]interface{})["time"] = int64(elapsed / time.Millisecond)
    msg["metrics"] = map[string]string{}
    msg["metrics"].(map[string]string)["machineid"] = machine_id
    msg["metrics"].(map[string]string)["instanceid"] = instance_id
    msg["metrics"].(map[string]string)["cpu"] = cpuinfo
    msg["metrics"].(map[string]string)["mem"] = meminfo
    msg["metrics"].(map[string]string)["uptime"] = uptime

    return msg

 }
	
 func randomTable(n int) [][]int {

    s1 := rand.NewSource(time.Now().UnixNano())
    r1 := rand.New(s1)

    m := make([][]int, n) 
    for i:=0; i<n; i++ {
        m[i] = make([]int, n)
        for j:=0; j<n; j++ {
            m[i][j] = r1.Intn(100)
        }
    }
    return m
}

func matrix(n int) [][]int {
    matrixA := randomTable(n)
    matrixB := randomTable(n)
    matrixMult := make([][]int, n)
 
    for i := 0; i < len(matrixA); i++ {
        matrixMult[i] = make([]int, n)
        for j := 0; j < len(matrixB); j++ {
            sum := 0
            for k := 0; k < len(matrixA); k++ {
                sum += matrixA[i][k] * matrixB[k][j]
            }
            matrixMult[i][j] = sum
        }
    }

    return matrixMult
}
