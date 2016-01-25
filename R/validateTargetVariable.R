#' @title Validate Target Variable
#'
#' @description Checks the validity of a target variable, a \code{numeric} variable usually of main interent.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param groupVar A \code{character}. The name of the column to be checked.
#'
#' @section Validation rule:
#' The column \code{targetVar} type in \code{data} must be \code{numeric} in R and \code{double} or \code{int} in the database.
#'
#' @return \code{TRUE} if \code{targetVar} is valid and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI


validateTargetVariable <- function(data, targetVar){

  if(is.character(data)){

    type = getDataTypes(data, targetVar)[,"ctype"]

    return(type == "int" || type == "double")

  }
  else if(is.data.frame(data)){

    return(is.numeric(data[,targetVar]))

  }

  stop("Parameter 'data' is not valid. It should be a data.frame or a character.")
}
