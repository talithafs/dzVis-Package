#' @title Validate Time Variables
#'
#' @description Checks the validity of a time variable.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param timeVar A \code{character}. The name of the column to be checked.
#'
#' @section Validation rule:
#' The column \code{timeVar} type must be \code{Date} in R and \code{date} or \code{datetime} in the database.
#'
#'
#' @return \code{TRUE} if \code{timeVar} is valid and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI


validateTimeVariable <- function(data, timeVar){

  message <- .ERROR_TIME

  if(is.character(data)){

    type = getDataTypes(data, timeVar)[,"ctype"]

    if(type == "date" || type == "datetime"){
      message <- .VALID
    }

    return(message)

  }
  else if(is.data.frame(data)){

    if(class(data[,timeVar]) == "Date"){
      message <- .VALID
    }

    return(message)

  }

  stop("Parameter 'data' is not valid. It should be a data.frame or a character.")

}
