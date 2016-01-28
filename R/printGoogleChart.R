#' @title Print Google Chart
#'
#' @description Prints a Google Chart to a .html file, encoded with UTF-8.
#'
#' @param filename A \code{character} value. The name of the output file. The extension (.html) is not needed.
#' @param chartObj A \code{gvis} object.
#'
#' @return \code{TRUE} if the file was correctly created and
#'         \code{FALSE}, otherwise.
#'
#' @seealso \code{\link[googleVis]{print.gvis}}
#'
#' @export
#' @import googleVis

printGoogleChart <- function(filename, chartObj){

  filename <- gsub("\\.htm$",".html",filename)

  if(!grepl("\\.html$", filename)) {
    filename <- paste(filename,".html",sep="")
  }

  con <- file(filename, encoding="utf8")
  print(chartObj, file = con)
  close(con)

}
