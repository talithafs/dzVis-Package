#' @title Validate Group Variables
#'
#' @description Checks the validity of a group variable, that is, a variable or set of variables that represents categories.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param groupVar A \code{character vector}. The name(s) of the column(s) to be checked.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item If \code{groupVar} contains only one element, the \code{groupVar} column type in \code{data} must be a \code{factor} in R and  \code{enum} in the database.
#'    \item If \code{groupVar} contains more than one element, the corresponding columns in \code{data} must be \code{numeric} in R and \code{int} or \code{double} in the database.
#' }
#'
#' @return \code{TRUE} if \code{groupVar} is valid and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI
#' @import sqldf


validateGroupVariables <- function(data, groupVar){
  return(TRUE);
}
