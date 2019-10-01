From golang:alpine3.8

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    go get -u github.com/rakyll/hey

CMD ["hey"]
