input <- read.csv("raw_general_dotnet.csv",header=T,sep=",")
png(file = "scatterplot_general_dotnet.png", width=1500, height=1000, units="px", pointsize=24)
par(mar=c(9,5,4,1)+.1)
stripchart(input$measured_ms ~ input$name, pch = 21, frame = FALSE, vertical = TRUE, method = "jitter", las=2, main = "Execution Time in .NET\n(Factors Test, x = 26'888'346'474'443)", xlab = "", ylab = "", ylim = c(0, 800),
col = c("#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#56B4E9", "#56B4E9", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939"))
title(ylab = "time (ms)", mgp=c(4,1,1))
grid (NULL,NULL,nx=0,col = "lightgray")
legend(10, 700, legend=c("AWS", "Azure", "IBM"),
col=c("#E69F00", "#56B4E9", "#E33939"),
pch=c(21,21,21), cex=1)
