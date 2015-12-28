#' @title Get attribute values
#'
#' @description Get top values of an attribute from a dzVis database table
#'
#' @param attribute The name of the column to be selected
#' @param table The name of the table to be selected
#' @param nvalues The number of values to be selected from the top.
#'
#' @return An array with the top \code{nvalues} values of \code{attribute}
#' from \code{table}.
#'
#' @seealso \code{\link{connect}}
#'
#' @export
#' @import DBI

getAttributeValues <- function(attribute, table, nvalues){
  connection <- connect()
  query <- paste("select", attribute, "from", table, "limit", nvalues, ";")
  data <- DBI::dbGetQuery(connection, query)
  disconnect(connection)
  list(values = as.list(data[,1]))
}
