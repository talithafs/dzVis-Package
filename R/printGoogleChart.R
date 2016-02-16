#' @title Print Google Chart
#'
#' @description Prints a Google Chart to a .html file, encoded with UTF-8.
#'
#' @param chartObj A \code{gvis} object.
#' @param filename A \code{character} value. The name of the output file. The extension (.html) is not needed.
#'
#' @return \code{character}. The name of the file where the chart was printed.
#'
#' @seealso \code{\link[googleVis]{print.gvis}}
#'
#' @export
#' @import googleVis

printGoogleChart <- function(chartObj, filename = NULL){

  if(is.null(filename)){
    filename <- chartObj$chartid
  }

  chartObj$chartid = ""

  filename <- gsub("\\.htm$",".html",filename)

  if(!grepl("\\.html$", filename)) {
    filename <- paste(filename,".html",sep="")
  }

  con <- file(filename, encoding="utf8")
  print(chartObj, file = con)
  close(con)

  return(filename)

}
