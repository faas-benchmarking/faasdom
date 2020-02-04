x <- read.csv("average_latency_all.csv",header=T,sep=",")
x <- t(x)
aws_node <- as.numeric(x[2,1:8])
azure_node <- as.numeric(x[6,1:8])
azure_win_node <- as.numeric(x[9,1:8])
google_node <- as.numeric(x[11,1:8])
ibm_node <- as.numeric(x[14,1:8])
png(file = "plot_average_latency_node.png", width=800, height=800, units="px", pointsize=24)
plot(aws_node, type="o", pch=2, lwd=2, lty=1, col = "#E69F00", xlab = "requests per second", ylab = "time (ms)", main = "Node.js Average Request Latency",ylim=c(0,3000), xaxt="n", las=1)
axis(1, at=1:8, labels=c("10", "25", "50", "100", "200", "400", "800", "1000"))
lines(azure_node,lty=1, type="o", pch=2, lwd=2, col = "#56B4E9")
lines(azure_win_node,lty=1, type="o", pch=2, lwd=2, col = "purple")
lines(google_node,lty=1, type="o", pch=2, lwd=2, col = "#00BA38")
lines(ibm_node,lty=1, type = "o", pch=2, lwd=2, col = "#E33939")
grid (NULL,NULL,nx=0,col = "lightgray")
legend(1, 2750, legend=c("AWS", "Azure", "Azure (Win)", "Google", "IBM"),
col=c("#E69F00", "#56B4E9", "purple", "#00BA38", "#E33939"), lwd=2,
lty=c(1,1,1,1,1), cex=0.8)

