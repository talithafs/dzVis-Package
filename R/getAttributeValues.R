#' @title Get attribute values from a dzVis table
#'
#' @description Get top values of an attribute - a column - from a dzVis database table
#' and save the results to a json file.
#'
#' @param attribute A \code{character} value. The name of the column to be selected
#' @param table A \code{character} value. The name of the table to be selected
#' @param nvalues A \code{numeric} value. The number of values to be selected from the top.
#'
#' @return The name of the file in which the results were written.
#'
#' @seealso \code{\link{connect}}
#'
#' @export
#' @import DBI

getAttributeValues <- function(attribute, table, nvalues){
  filename <- "attributes.json"

  connection <- connect()
  query <- paste("select", attribute, "from", table, "limit", nvalues, ";")
  data <- DBI::dbGetQuery(connection, query)
  disconnect(connection)

  if(createJSONFile(list(values = data[,1]), filename) == TRUE) {
    return(filename)
  }

  stop("JSON file was not created.")

}
