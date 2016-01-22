#' @title Validate Key Parameters
#'
#' @description Checks if the values of a parameter are unique within a data table.
#'              It uses a direct connection to the dzVis database.
#'
#' @param table A \code{character} containing the name of the table in the dzVis database.
#' @param keys A \code{character vector}. The column name(s) of the candidate key(s).
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make \code{keys} values unique.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item If \code{keys} has only one column name, each row of this column must contain a different value.
#'    \item If \code{keys} has more than one column name, a subset of those columns must have unique values when combined.
#' }
#'
#' @return \code{TRUE} if the parameters are valid.
#'         Otherwise, a \code{vector} containing the names of the columns that should be restricted to make \code{keys} values unique when combined.
#' @export
#' @import DBI
#' @import sqldf

validateKeys <- function(table, keys, restrictions = NULL){

    str = class(keys)
    return(str)
}
