#!/usr/bin/env python3
import time
import math

def python_factors(request):

    n = 2688834647444046

    start = time.time()
    result = factors(n)
    end = time.time()
    elapsed = (end - start)*1000

    return '{"n":' + str(n) + ',"result":' + str(result) + ',"time(ms)": ' + str(elapsed) + '}'

def factors(num):
    n_factors = []

    for i in range(1, math.floor(math.sqrt(num))+1):
        if num % i == 0:
            n_factors.append(i)
            if num / i != i:
                n_factors.append(int(num / i))

    n_factors.sort()

    return n_factors