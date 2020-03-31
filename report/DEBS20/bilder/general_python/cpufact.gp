set term postscript color eps enhanced 22
set encoding utf8
set output "cpufact.eps"
load "../styles.inc"
set size 1.0,0.9
set ylabel "Time [ms]"
set tmargin 3

set bmargin 7
set rmargin 6

set title "{/bold Execution Time, {/Courier faas-fact} benchmark}" offset 0,1

set yrange [0:12000]

set xtics nomirror
set grid y

set datafile separator ","
set key vertical maxrows 1 sample 1.0 width 0 at 16,13800
set xtics rotate by -45 font "Arial,18"
plot \
  "data/aws.csv"\
	using 1:7:xtic(10) every 1 with p ls 2101 title "AWS",\
  "data/azure.csv"\
	using 1:7:xtic(10) every 1 with p ls 2102 title "Azure",\
  "data/google.csv"\
    using 1:7:xtic(10) every 1 with p ls 2103 title "Google",\
  "data/ibm.csv"\
    using 1:7:xtic(10) every 1 with p ls 2104 title "IBM",\
	
	
!epstopdf "cpufact.eps"
!rm "cpufact.eps"
