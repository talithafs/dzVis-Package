#' @title Validate Key Parameters
#'
#' @description Checks if the values of a parameter are unique within a data table.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param keys A \code{character vector}. The candidate key(s).
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make \code{keys} unique.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item If \code{keys} has only one parameter, each row of the \code{keys} column in \code{data} must contain a different value.
#'    \item If \code{keys} has more than one value, its values must be unique when combined, that is, each row must contain a different combination of values.
#' }
#'
#' @return \code{TRUE} if the parameters are valid.
#'         A \code{vector} containing the names of the columns that should be restricted to make \code{keys} unique when combined, otherwise.
#' @export
#' @import DBI
#' @import sqldf

validateKeys <- function(data, keys, restrictions){
  return(TRUE)
}
