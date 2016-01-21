#' @title Validate Limits Imposed on a Column
#'
#' @description Checks the validity of inequality restrictions imposed on a column.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param columnName A \code{character}. The name of the column to be checked.
#' @param min A \code{numeric} value or a \code{Date} in the format 'yyyy-mm-dd'. Lower bound for the column value. Should be set to \code{NULL} when not applicable.
#' @param max A \code{numeric} value or a \code{Date} in the format 'yyyy-mm-dd'. Upper bound for the column value. Should be set to \code{NULL} when not applicable.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item \code{min} and \code{max} must be of the same type: both \code{numeric} or both \code{character}.
#'    \item \code{min} must be less than \code{max}
#'    \item If their type is \code{numeric}, the column values must also be \code{numeric} in R and \code{int} or \code{double} in the database.
#'    \item If their type is \code{character}, the column values must be \code{character} or \code{Date} in R and \code{date} in the database
#' }
#'
#' @return \code{TRUE} if the limits are valid and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI
#' @import sqldf

validateLimits <- function(data, columnName, min, max){

}
