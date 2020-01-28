input <- read.csv("raw_coldstart_all_data.csv",header=T,sep=",")
png(file = "scatterplot_coldstart_all.png", width=1600, height=800, units="px", pointsize=24)
par(mar=c(9,4,4,2)+.1)
stripchart(input$ms ~ input$order, pch = 21, frame = FALSE, vertical = TRUE, method = "jitter",
    las=2, main = "Cold Start Latency", xlab = "", ylab = expression(bold("time (ms)")), ylim = c(0, 5000),
    col = c("#E69F00", "#E69F00", "#E69F00", "#E69F00", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", 
    "#00BA38", "#00BA38", "#00BA38", "#E33939", "#E33939", "#E33939", "#E33939"),
    group.names=c("AWS - Node.js", "AWS - Python", "AWS - Go", "AWS - .NET", "Azure - Node.js", "Azure - Python", "Azure - .NET", "Azure (Win) - Node.js", "Azure (Win) - .NET", "Google - Node.js", "Google - Python", "Google - Go", "IBM - Node.js", "IBM - Python", "IBM - Go", "IBM - .NET"))
grid (NULL,NULL,nx=0,col = "lightgray")
