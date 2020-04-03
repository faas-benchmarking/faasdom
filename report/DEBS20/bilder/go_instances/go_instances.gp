set term postscript color eps enhanced 22
set encoding utf8
set output "go_instances.eps"
load "../styles.inc"
set size 1.0,0.7
set ylabel "Active instances"
set xlabel "Time during execution of {/Courier-bold wrk2} workload (seconds)"
set tmargin 3

set bmargin 4
set rmargin 3

set title "{/bold Go active instances}" offset 0,0

set yrange [0:100]
set xrange [435:458]
set xtics nomirror
set grid y
set xtics ("0" 435,"5" 440, "10" 445, "15" 450, "20" 455, "25" 460)
#set datafile separator ","
set key vertical maxrows 1 sample 1.0 width 0 at 16,13800
#set xtics rotate by -45 font "Arial,18"
plot \
  "google_sampled_data.txt"\
    using 1:2 every 1 with lp ls 2103 notitle "Google"
	
!epstopdf "go_instances.eps"
!rm "go_instances.eps"
