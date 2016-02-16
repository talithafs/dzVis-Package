#' @title Create a JSON file
#'
#' @description Creates a .JSON file from a list, encoded with UTF-8.
#'
#' @param data A \code{list} object to be converted to a json object
#' @param filename A \code{character} value. The name of the output file
#'
#' @return \code{TRUE} if the file was correctly created and
#'         \code{FALSE}, otherwise
#'
#' @importFrom jsonlite toJSON

createJSONFile <- function(data, filename = "output.json") {

  #if(class(data) != "list"){
   # return(FALSE)
  #}

  json <- jsonlite::toJSON(data)
  con <- file(filename, encoding="utf8")
  write(json, file = con)
  close(con)
  return(TRUE)
}
