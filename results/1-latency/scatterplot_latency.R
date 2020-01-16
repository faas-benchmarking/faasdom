input <- read.csv("raw_latency_data.csv",header=T,sep=",")
png(file = "scatterplot_latency.png", width=3000, height=1000, units="px", pointsize=24)
par(mar=c(10,4,4,1)+.1)
stripchart(input$ms ~ input$cloud, pch = 21, frame = FALSE, vertical = TRUE, method = "jitter",
    las=2, main = "Latency of Cloud Functions measured from Bern, Switzerland", xlab = "", ylab = "time (ms)",
    col = c("#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00",
    "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00",
    "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", 
    "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", 
    "#E33939", "#E33939", "#E33939", "#E33939", "#E33939"))
grid (NULL,NULL,nx=0,col = "lightgray") 
