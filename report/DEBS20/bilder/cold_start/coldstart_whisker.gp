set term postscript color eps enhanced 22
set encoding utf8
set output "coldstart_whisker.eps"
load "../styles.inc"
NX=2
NY=1
# Size of graphs
SX=0.6
SY=0.57

# Margins
MX=0.1
MY=0.1
# Space between graphs
IX=-0.05
IY=0
# Space for legends
LX=0.05
LY=0.01

set size 1.0,0.6

set lmargin MX+0.5
set rmargin MX+12

set tmargin MY+4
set bmargin MY+0

set multiplot

set ytics nomirror
set grid y

set origin MX+LX+0*(IX+SX),MY+0*(IY+SY)+LY
set size 0.4,SY
set title "{/bold Cold Start Effect on different providers}" offset 12,0
set ylabel "Latency [ms]" #offset 1,0
#set ytics nomirror

set style fill solid
set boxwidth 0.2 absolute
set xrange [0.25:4.5]

set grid y 
set ytics mirror
set yrange[0:5000]

set xlabel "AWS" offset 0,0.5
set xtics ("" 0,"" 1, "" 2.0, "" 3,  "" 4) nomirror
set key vertical sample 1.0 width -2 maxrows 1 at 4.2,60 font "Arial, 18"
unset key
#http://www.phy.ntnu.edu.tw/demolab/html.php?html=doc/gnuplot-doc/html/candlesticks
# whisker plot:     x  box_min  whisker_min  whisker_high  box_high
plot "data/aws.txt" using ($1):($2):($6):($7):($4)  with candlesticks whiskerbars 0.5 ls 2101 notitle "",\
           ''     using 1:($3):($3):($3):($3) with candlesticks ls 2101 notitle,\
     100000000 ls 2101 title "AWS"
	   
set origin MX+LX+1*(IX+SX)-0.35,MY+0*(IY+SY)+LY
unset title
set size 0.4,SY
set xlabel "Azure" offset 0,0.5
unset ylabel
set ytics ("" 0, "" 1000, "" 2000, "" 3000, "" 4000, "" 5000)
set xrange [0.25:5.5]

set xtics ("" 0,"" 1, "" 2.0, "" 3,  "" 4,"" 5) nomirror
plot "data/azure.txt" using ($1):($2):($6):($7):($4)  with candlesticks whiskerbars 0.5 ls 2102 notitle "",\
           ''     using 1:($3):($3):($3):($3) with candlesticks ls 2102 notitle,\
     100000000 ls 2102 title "Azure"


set origin MX+LX+2*(IX+SX)-0.7,MY+0*(IY+SY)+LY
set size 0.4,SY
set xlabel "Google" offset 0,0.5
set xrange [0.25:3.5]
set xtics ("" 0,"" 1, "" 2.0, "" 3) nomirror
plot "data/google.txt" using ($1):($2):($6):($7):($4)  with candlesticks whiskerbars 0.5 ls 2103 notitle "",\
        ''     using 1:($3):($3):($3):($3) with candlesticks ls 2103 notitle,\
  100000000 ls 2103 title "Google"

set origin MX+LX+3*(IX+SX)-1.05,MY+0*(IY+SY)+LY
set size 0.4,SY
set xlabel "IBM" offset 0,0.5
set xrange [0.25:4.5]
set xtics ("" 0,"" 1, "" 2.0, "" 3, "" 4) nomirror
plot "data/ibm.txt" using ($1):($2):($6):($7):($4)  with candlesticks whiskerbars 0.5 ls 2104 notitle "",\
        ''     using 1:($3):($3):($3):($3) with candlesticks ls 2104 notitle,\
  100000000 ls 2104 title "IBM"

		
!epstopdf "coldstart_whisker.eps"
!rm "coldstart_whisker.eps"
quit
