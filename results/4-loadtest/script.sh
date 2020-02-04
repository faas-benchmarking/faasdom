#!/bin/bash

# URLs, cannot be empty, otherwise script won't work!
AWS_NODE="0"
AWS_PYTHON="1"
AWS_GO="2"
AWS_DOTNET="3"
AZURE_NODE="4"
AZURE_PYTHON="5"
AZURE_DOTNET="6"
AZURE_WIN_NODE="7"
AZURE_WIN_DOTNET="8"
GOOGLE_NODE="9"
GOOGLE_PYTHON="10"
GOOGLE_GO="11"
IBM_NODE="12"
IBM_PYTHON="13"
IBM_GO="14"
IBM_DOTNET="15"

declare -a clouds=($AWS_NODE $AWS_PYTHON $AWS_GO $AWS_DOTNET $AZURE_NODE $AZURE_PYTHON $AZURE_DOTNET $AZURE_WIN_NODE $AZURE_WIN_DOTNET $GOOGLE_NODE $GOOGLE_PYTHON $GOOGLE_GO $IBM_NODE $IBM_PYTHON $IBM_GO $IBM_DOTNET)
declare -a resultfiles=("aws_node" "aws_python" "aws_go" "aws_dotnet" "azure_node" "azure_python" "azure_dotnet" "azure_win_node" "azure_win_dotnet" "google_node" "google_python" "google_go" "ibm_node" "ibm_python" "ibm_go" "ibm_dotnet" )
declare -a rps=(10 25 50 100 200 400 800 1000)

for i in "${!clouds[@]}" #"${!clouds[@]}" or 0..0 for first one etc.
do
    for j in "${!rps[@]}"
    do
        if [ $j -eq 0 ]
        then
            curl ${clouds[$i]} &> /dev/null
        fi
        echo "Processing ${resultfiles[$i]} @${rps[$j]} RPS for 60s"
        ./wrk2/wrk -t2 -c${rps[$j]} -d60s -R${rps[$j]} -L ${clouds[$i]} > ${resultfiles[$i]}_${rps[$j]}.txt
        sleep 10s
    done
done

