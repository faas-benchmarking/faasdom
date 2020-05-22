set term postscript color eps enhanced 22
set encoding utf8
set output "tputlat_combined.eps"
load "../styles.inc"
NX=4
NY=1
# Size of graphs
SX=0.6
SY=0.57

# Margins
MX=0.1
MY=0.1
# Space between graphs
IX=0.05
IY=0
# Space for legends
LX=0.05
LY=0.01

set size 2.0,0.65

set lmargin MX+0.5
set rmargin MX+12

set tmargin MY+3.5
set bmargin MY+1

set multiplot

set ytics nomirror
set grid y

set origin MX+LX+0*(IX+SX)-0.005,MY+0*(IY+SY)+LY
set size 0.6,SY
set ylabel "Average Latency\n[ms, x1000]" offset -0.5,0
set ytics nomirror
set grid y
set yrange[0:3000]
set xtics ("10" 1,"25" 2,"50" 3,"100" 4,"200" 5, "400" 6, "800" 7) rotate by -45
set ytics ("0" 0, "0.5" 500, "1" 1000, "1.5" 1500, "2" 2000, "2.5" 2500, "3" 3000)
set xlabel "Request Rate" offset 0,0
set title "Node.js" offset 0,-0.6 font "Arial-bold,18"
set datafile separator ","
set key vertical sample 1.0 width 0 maxrows 1 at screen 1.0,0.62 center 

plot\
	 "average_latency_all.csv" using ($1):($3)  w lp ls 2101 title "AWS",\
	 "average_latency_all.csv" using ($1):($7)  w lp ls 2102 title "Azure",\
	 "average_latency_all.csv" using ($1):($10) w lp ls 2105 title "Azure (win)",\
	 "average_latency_all.csv" using ($1):($12) w lp ls 2103 title "Google",\
	 "average_latency_all.csv" using ($1):($15) w lp ls 2104 title "IBM",\

unset key  

set origin MX+LX+1*(IX+SX)-0.16,MY+0*(IY+SY)+LY
set size 0.6,SY
set yrange[0:30000]
unset ylabel
set ytics ("0" 0, "5" 5000, "10" 10000, "15" 15000, "20" 20000, "25" 25000, "30" 30000)
set title "Python"
plot\
	 "average_latency_all.csv" using ($1):($4)  w lp ls 2101 notitle "aws",\
	 "average_latency_all.csv" using ($1):($8)  w lp ls 2102 notitle "azure",\
	 "average_latency_all.csv" using ($1):($13) w lp ls 2103 notitle "google",\
	 "average_latency_all.csv" using ($1):($16) w lp ls 2104 notitle "ibm",\


set origin MX+LX+2*(IX+SX)-0.33,MY+0*(IY+SY)+LY
set size 0.6,SY
set yrange[0:7000]
set ytics ("0" 0, "1" 1000, "2" 2000, "3" 3000, "4" 4000, "5" 5000, "6" 6000,"7" 7000)
set title "Go (Azure unsupported)"
plot\
	 "average_latency_all.csv" using ($1):($5)  w lp ls 2101 notitle "aws",\
	 "average_latency_all.csv" using ($1):($14)  w lp ls 2103 notitle "google",\
	 "average_latency_all.csv" using ($1):($17) w lp ls 2104 notitle "ibm",\

set origin MX+LX+3*(IX+SX)-0.5,MY+0*(IY+SY)+LY
set size 0.6,SY
set yrange[0:7000]
set title ".NET (Google unsupported)"
plot\
	 "average_latency_all.csv" using ($1):($6)  w lp ls 2101 notitle "aws",\
 	 "average_latency_all.csv" using ($1):($9)  w lp ls 2102 notitle "azure",\
	 "average_latency_all.csv" using ($1):($11)  w lp ls 2105 title "Azure-win",\
	 "average_latency_all.csv" using ($1):($18) w lp ls 2104 notitle "ibm",\

		
!epstopdf "tputlat_combined.eps"
!rm "tputlat_combined.eps"
quit
