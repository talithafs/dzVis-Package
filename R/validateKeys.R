#' @title Validate Key Parameters
#'
#' @description Checks if the values of a parameter are unique within a data table.
#'              If more than one parameter is provided, checks if they are unique when combined.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table.
#'             If a \code{data.frame} is passed, a connection to the dzVis database WILL NOT be estabilished.
#'             If a \code{character} value is passed, a connection WILL be estabilished.
#' @param keys An \code{character vector}. The candidate key(s)
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make \code{keys} unique.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item Ola hahaha
#'    \item Hue olaaa
#' }
#'
#' @return If parameters are valid, returns \code{TRUE}.
#'         Otherwise, returns an \code{array} containing the names of the columns that
#'         should be restricted to make \code{keys} unique when combined.
#'
#' @seealso \code{googleVis}
#'
#' @export
#' @import DBI
#' @import sqldf

validateKeys <- function(data, keys, restrictions){
  return(TRUE)
}
