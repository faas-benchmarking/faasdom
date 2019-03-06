# OpenWhisk Install Guide

from: [https://github.com/apache/incubator-openwhisk/tree/master/tools/ubuntu-setup](https://github.com/apache/incubator-openwhisk/tree/master/tools/ubuntu-setup)

```shell
# Install git if it is not installed
sudo apt-get install git -y

# Clone openwhisk
git clone https://github.com/apache/incubator-openwhisk.git openwhisk

# Change current directory to openwhisk
cd openwhisk

# Install all required software
(cd tools/ubuntu-setup && ./all.sh)
```

## CouchDB

from: [http://docs.couchdb.org/en/latest/install/unix.html#installation-using-the-apache-couchdb-convenience-binary-packages](http://docs.couchdb.org/en/latest/install/unix.html#installation-using-the-apache-couchdb-convenience-binary-packages) and [https://www.howtoforge.com/tutorial/ubuntu-couchdb/](https://www.howtoforge.com/tutorial/ubuntu-couchdb/)

```shell
echo "deb https://apache.bintray.com/couchdb-deb bionic main" | sudo tee -a /etc/apt/sources.list
curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \ | sudo apt-key add -
sudo apt-get update -y
sudo apt-get install -y couchdb
```

Then on the graphical GUI choose:

- standalone
- 127.0.0.1
- password
- repeat password

TODO: configure CloudDB for OpenWhisk

## Build

```shell
cd <home_openwhisk>
sudo ./gradlew distDocker
```

TODO
