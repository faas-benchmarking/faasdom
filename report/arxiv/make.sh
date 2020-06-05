#!/bin/bash

for i in `find . -name *.eps`
do
    f_=${i%.eps}
    if [[ $f_.eps -nt $f_.pdf || ! -e $f_.pdf ]]
    then
	epstopdf $i
    fi
done

pdflatex main
bibtex   main
pdflatex main
pdflatex main

