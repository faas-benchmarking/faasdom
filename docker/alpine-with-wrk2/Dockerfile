FROM alpine:3.10

RUN apk add --update alpine-sdk openssl-dev
RUN apk add --no-cache git zlib-dev
RUN git clone https://github.com/giltene/wrk2.git && cd wrk2 && make

ENTRYPOINT ["wrk2/wrk"]