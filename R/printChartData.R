#' @title Print chart data
#'
#' @description Writes chart data in a .csv file
#'
#' @param data A \code{data.frame}. The data to be written.
#' @param chart A \code{character}. The name of the chart or of the file in which the chart was printed.
#'
#' @return A \code{character}. The name of the file that was printed, including its extension (.csv)

printChartData <- function(data, chart){

  filename <- paste("DATA_", gsub(".html","",chart), ".csv", sep="")
  con <- file(filename, encoding="utf8")
  write.csv(data, file = con, row.names = FALSE)

  return(filename)
}
