x <- read.csv("average_latency_all.csv",header=T,sep=",")
x <- t(x)
aws_go <- as.numeric(x[4,1:8])
google_go <- as.numeric(x[13,1:8])
ibm_go <- as.numeric(x[16,1:8])
png(file = "plot_average_latency_go.png", width=800, height=800, units="px", pointsize=24)
plot(aws_go, type="o", pch=2, lwd=2, lty=1, col = "#E69F00", xlab = "requests per second", ylab = "time (ms)", main = "Go Average Request Latency",ylim=c(0,7000), xaxt="n", las=1)
axis(1, at=1:8, labels=c("10", "25", "50", "100", "200", "400", "800", "1000"))
lines(google_go,lty=1, type = "o", pch=2, lwd=2, col = "#00BA38")
lines(ibm_go,lty=1, type = "o", pch=2, lwd=2, col = "#E33939")
grid (NULL,NULL,nx=0,col = "lightgray")
legend(3, 6500, legend=c("AWS", "Google", "IBM"),
col=c("#E69F00", "#00BA38", "#E33939"), lwd=2,
lty=c(1,1,1), cex=0.8)

