x <- read.csv("average_latency_all.csv",header=T,sep=",")
x <- t(x)
aws_dotnet <- as.numeric(x[5,1:8])
azure_dotnet <- as.numeric(x[8,1:8])
azure_win_dotnet <- as.numeric(x[10,1:8])
ibm_dotnet <- as.numeric(x[17,1:8])
png(file = "plot_average_latency_dotnet.png", width=800, height=800, units="px", pointsize=24)
plot(aws_dotnet, type="o", pch=2, lwd=2, lty=1, col = "#E69F00", xlab = "requests per second", ylab = "time (ms)", main = ".NET Average Request Latency",ylim=c(0,1500), xaxt="n", las=1)
axis(1, at=1:8, labels=c("10", "25", "50", "100", "200", "400", "800", "1000"))
lines(azure_dotnet,lty=1, type = "o", pch=2, lwd=2, col = "#56B4E9")
lines(azure_win_dotnet,lty=1, type = "o", pch=2, lwd=2, col = "purple")
lines(ibm_dotnet,lty=1, type = "o", pch=2, lwd=2, col = "#E33939")
grid (NULL,NULL,nx=0,col = "lightgray")
legend(1, 1450, legend=c("AWS", "Azure", "Azure (Win)", "IBM"),
col=c("#E69F00", "#56B4E9", "purple", "#E33939"), lwd=2,
lty=c(1,1,1,1), cex=0.8)

