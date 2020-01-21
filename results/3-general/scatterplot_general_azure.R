input <- read.csv("raw_general_azure_data.csv",header=T,sep=",")
png(file = "scatterplot_general_azure.png", width=1000, height=1000, units="px", pointsize=24)
stripchart(input$measured_ms ~ input$name, pch = 21, frame = FALSE, vertical = TRUE, method = "jitter", main = "Execution Time on Azure, 1536 MB\n(Factors Test, x = 26'888'346'474'443)", xlab = "", ylab = "time (ms)", ylim = c(0, 8000), col = c("#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9", "#56B4E9"))
grid (NULL,NULL,nx=0,col = "lightgray")
