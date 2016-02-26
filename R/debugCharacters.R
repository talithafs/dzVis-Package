#' @title Debug characters
#'
#' @description Converts dirty and special characters that were misinterpreted by OpenCPU as Latin1 instead of UTF-8
#'
#' @param string A \code{character}. The string to be debugged
#'
#' @return string A \code{character}. The converted string
#'
#' @export
#' @import DBI


debugCharacters <- function(string){

  raw <- as.integer(charToRaw(string))
  char <- paste(as.character(raw), collapse=",")

  # Weird sequence that OpenCPU inserts between the two UTF-8 bytes of special characters
  char <- gsub("131,194,","",char)

  # Ã to Á
  char <- gsub("195,129","193",char)

  # Ã¡ to á
  char <- gsub("195,161","225",char)

  # Ã£ to ã
  char <- gsub("195,163","227",char)

  raw <- as.integer(strsplit(char, split=",")[[1]])
  string <- rawToChar(as.raw(raw))

  return(string)
}


