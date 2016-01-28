#' @title Validate Group Variable
#'
#' @description Checks the validity of a group variable, that is, a variable or set of variables that represents categories.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param groupVar A \code{character}. The name of the column to be checked.
#'
#' @section Validation rules:
#' The \code{groupVar} column type must be a \code{factor} in R and \code{enum} in the database.
#'
#'
#' @return A \code{character}. The constant \code{.VALID} if the variable is valid and
#'         an error message, otherwise.
#'
#' @export


validateGroupVariable <- function(data, groupVar){

  message <- .ERROR_GROUP

  if(is.character(data)){

    type <- getDataTypes(data,groupVar)[,"ctype"]

    if(type == "enum"){
      message <- .VALID
    }

    return(message)
  }
  else if(is.data.frame(data)){

    if(is.factor(data[,groupVar])){
      message <- .VALID
    }

    return(message)
  }

  stop("Parameter 'data' is not valid. It should be a data.frame or a character.");
}
