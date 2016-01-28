#' @title Validate key parameters
#'
#' @description Checks if the values of a parameter are unique within a data table.
#'              It uses a direct connection to the dzVis database.
#'
#' @param table A \code{character}. The name of the table in the dzVis database.
#' @param keys A \code{character vector}. The column name(s) of the candidate key(s).
#'
#' @section Validation rules:
#' \enumerate{
#'    \item If \code{keys} has only one column name, each row of this column must contain a different value.
#'    \item If \code{keys} has more than one column name, a subset of those columns must have unique values when combined.
#' }
#'
#' @return A \code{character}. The constant \code{.VALID} if the parameters are valid.
#'         Otherwise, a \code{vector} containing the names of the columns that should be restricted to make \code{keys} values unique when combined.
#'
#' @export

validateKeys <- function(table, candidateKeys, connection = NULL){

  conn <- connection
  restrictions <- NULL

  if(is.null(connection)){
    conn <- connect()
  }

  query = paste("describe", table)
  info <- dbGetQuery(conn, query)

  actualKeys <- info[info$Key == "PRI","Field"]

  for(key in actualKeys){
    if(!(key %in% candidateKeys)){
      restrictions <- c(restrictions, key)
    }
  }

  if(is.null(connection)) {
    disconnect(conn)
  }


  if(is.null(restrictions)){
    return(.VALID)
  }

  return(restrictions)

}
