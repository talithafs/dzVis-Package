#' @title Create a JSON file
#'
#' @description Creates a .JSON file from a list, encoded with UTF-8.
#'
#' @return \code{TRUE} if the file was correctly created and
#'         \code{FALSE} otherwise
#'
#' @param data A list object to be converted to a json object
#' @param filename The name of the output file
#'
#' @export
#' @importFrom jsonlite toJSON

createJSONFile <- function(data, filename = "output.json") {

  if(class(data) != "list"){
    return(FALSE)
  }

  json <- jsonlite::toJSON(data)
  con <- file(filename, encoding="utf8")
  write(json, file = con)
  return(TRUE)
}
