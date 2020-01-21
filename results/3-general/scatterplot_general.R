input <- read.csv("raw_general_all_data.csv",header=T,sep=",")
png(file = "scatterplot_general.png", width=3000, height=1000, units="px", pointsize=24)
par(mar=c(11,5,4,1)+.1)
stripchart(input$measured_ms ~ input$name, pch = 21, frame = FALSE, vertical = TRUE, method = "jitter",
    las=2, main = "Execution Time of Cloud Functions (Factors Test, x = 26'888'346'474'443)", xlab = "", ylab = "",
col = c("#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00","#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00","#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00","#E69F00", "#E69F00", "#E69F00", "#E69F00", "#E69F00", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#00BA38", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939", "#E33939"))
title(ylab = "time (ms)", mgp=c(4,1,1))
grid (NULL,NULL,nx=0,col = "lightgray")
