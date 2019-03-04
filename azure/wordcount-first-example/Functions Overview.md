# Functions Overview

This document gives a short overview of all functions and what they do and how they are called.

## wordcount

The function (wordcount)[/wordcount] counts the number of words in a given text.

It is deployed at: (https://wordcount-first-example.azurewebsites.net/api/wordcount)[https://wordcount-first-example.azurewebsites.net/api/wordcount]

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