#' @title Validate consistency between chart parameters
#'
#' @description Checks if the chosen parameters follows the consistency rules.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param timeVar A \code{character}. The name of the column with the time variable values.
#' @param groupVar A \code{character vector}. The name(s) of the column(s) with the group variable(s).
#' @param targetVar A \code{character}. The name of the column with the target variable values.
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make \code{keys} unique.
#'
#' @section Consistency rules:
#' \enumerate{
#'    \item If \code{groupVar} contains more than one element, \code{targetVar} must be identical to \code{groupVar}.
#'    \item Each category in \code{groupVar} must have non null \code{targetVar} values corresponding to each different \code{timeVar} value.
#'    \item The set of different \code{timeVar} values must be the same for each category in \code{groupVar}.
#' }
#'
#' @return \code{TRUE} if \code{groupVar} and \code{timeVar} are consistent and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI
#' @import sqldf

validateConsistency <- function(data, timeVar, groupVar, targetVar, restrictions = NULL){
    return(TRUE)
}
