set term postscript color eps enhanced 22
set encoding utf8
set output "latency.eps"
load "../styles.inc"
set size 2.2,1.1

#set xlabel "Time (s)" offset 0,0.5
set ylabel "Latency [ms]"
set tmargin 2
set bmargin 10
set rmargin 4


set title "{/bold Latency of cloud functions over 4 cloud providers and 39 different regions}" offset 0,-0.5
#set ytics 10000000
set yrange [0:2500]
#set mytics 10
set xtics nomirror
#set format y "%.0s%cbit/s"
#set format y "%.0s"
#set xtics 5
#set mxtics 5
set grid y

#set arrow from 3.5, graph 0 to 3.5, graph 1 nohead
#set label "Cli. 2\n start" at 0.4,32000000 font "Helvetica, 18" rotate by 20
#
#set arrow from 8, graph 0 to 8, graph 1 nohead
#set label "Cli. 3\n start" at 8.2,32000000 font "Helvetica, 18" rotate by 20
#
#set arrow from 24.2, graph 0 to 24.2, graph 1 nohead
#set label "Cli. 2\n stop" at 21,32000000 font "Helvetica, 18" rotate by 20
#
#set arrow from 40.6, graph 0 to 40.6, graph 1 nohead
#set label "Cli. 3\n stop" at 41,32000000 font "Helvetica, 18" rotate by 20
#
#set obj 9 rect from screen 0.3,0.517 to screen 0.82,0.556 dt 3 behind
set datafile separator ","
set key vertical maxrows 1 sample 1.0 width 0
set xtics rotate by -45
#set key above horizontal
plot \
  "data/aws.csv"\
	using 1:3:xtic(2) every 1 with p ls 2101 title "AWS",\
  "data/azure.csv"\
	using 1:3:xtic(2) every 1 with p ls 2102 title "Azure",\
  "data/google.csv"\
    using 1:3:xtic(2) every 1 with p ls 2103 title "Google",\
  "data/ibm.csv"\
    using 1:3:xtic(2) every 1 with p ls 2104 title "IBM",\
	
	
!epstopdf "latency.eps"
!rm "latency.eps"

#,
#  "data/azure.csv"\
#  	using 1:2:xtic(1) every 1 with p ls 2102,
#  "data/google.csv"\
#  	using 1:2:xtic(1) every 1 with p ls 2103,
#  "data/ibm.csv"\
#  	using 1:2:xtic(1) every 1 with p ls 2104,				   
#  80000000\
#  	 w lp ls 2101 title "Client 1",\
#  80000000\
#  	 w lp ls 2102 title "Client 2",\
#  80000000\
# 	 w lp ls 2103 title "Client 3"	  	
#