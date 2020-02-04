x <- read.csv("average_latency_all.csv",header=T,sep=",")
x <- t(x)
aws_python <- as.numeric(x[3,1:8])
azure_python <- as.numeric(x[7,1:8])
google_python <- as.numeric(x[12,1:8])
ibm_python <- as.numeric(x[15,1:8])
png(file = "plot_average_latency_python.png", width=800, height=800, units="px", pointsize=24)
par(mar=c(5,5,4,2)+.1)
plot(aws_python, type="o", pch=2, lwd=2, lty=1, col = "#E69F00", xlab = "requests per second", ylab = "", main = " Python Average Request Latency",ylim=c(0,30000), xaxt="n", las=1)
axis(1, at=1:8, labels=c("10", "25", "50", "100", "200", "400", "800", "1000"))
lines(azure_python,lty=1, type="o", pch=2, lwd=2, col = "#56B4E9")
lines(google_python,lty=1, type="o", pch=2, lwd=2, col = "#00BA38")
lines(ibm_python,lty=1, type = "o", pch=2, lwd=2, col = "#E33939")
title(ylab = "time (ms)", mgp=c(4,1,1))
grid (NULL,NULL,nx=0,col = "lightgray")
legend(6, 27000, legend=c("AWS", "Azure", "Google", "IBM"),
col=c("#E69F00", "#56B4E9", "#00BA38", "#E33939"), lwd=2,
lty=c(1,1,1,1), cex=0.8)

