#!/bin/sh

# simple deploy script, words only if the directory has the corresponding name to the function project in azure

func azure functionapp publish ${PWD##*/}