# Functions Overview

This document gives a short overview of all functions and what they do and how they are called.

## wordcount

The function [wordcount](wordcount) counts the number of words in a given text.
It is triggered by a HTTP request and the response comes with the HTTP response.

It is deployed at: [https://wordcount-first-example.azurewebsites.net/api/wordcount](https://wordcount-first-example.azurewebsites.net/api/wordcount)

Request example (curl):

```shell
curl --request POST --data '{"data":"Lorem ipsum dolor sit amet."}' https://wordcount-first-example.azurewebsites.net/api/wordcount
```

Response example:

```shell
{"words":5}
```

General request:

```
Url: https://wordcount-first-example.azurewebsites.net/api/wordcount
Method: POST
Body: {"data": "This is an example of a text to count words of."}
```

Response:

```
{"words":11}
```

## wordcount-storage-trigger

The function [wordcount-storage-trigger](wordcount-storage-trigger) counts the number of words in a given text.
It is triggered by a write on a blob storage and outputs the result to the same file in the same blob under the folder `result`.