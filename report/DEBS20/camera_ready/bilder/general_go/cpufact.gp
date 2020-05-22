set term postscript color eps enhanced 22
set encoding utf8
set output "cpufact.eps"
load "../styles.inc"
set size 1.0,0.8
set ylabel "Time [ms]"
set tmargin 3.5

set bmargin 3.5
set rmargin 6

set title "{/bold Execution time of {/Courier-bold faas-fact} (Go)}" offset 0,1

set yrange [0:1400]

set xtics nomirror
set grid y

set datafile separator ","
set key vertical maxrows 1 sample 1.0 width 0 at screen 0.5,0.68 center font "Arial-Condensed"
set xtics rotate by -45 font "Arial,18"
plot \
  "data/aws.csv"\
	using 1:7:xtic(10) every 1 with p ls 2101 title "AWS",\
  "data/google.csv"\
    using 1:7:xtic(10) every 1 with p ls 2103 title "Google",\
  "data/ibm.csv"\
    using 1:7:xtic(10) every 1 with p ls 2104 title "IBM",\
	
	
!epstopdf "cpufact.eps"
!rm "cpufact.eps"
