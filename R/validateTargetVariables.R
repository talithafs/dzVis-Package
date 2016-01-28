#' @title Validate Target Variables
#'
#' @description Checks the validity of a target variable, a \code{numeric} variable usually of main interent.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param targetVar A \code{character vector}. The name(s) of the column(s) to be checked.
#'
#' @section Validation rule:
#' Each column whose name is in \code{targetVar} must be \code{numeric} in R and \code{double} or \code{int} in the database.
#'
#' @return A \code{character}. The constant \code{.VALID} if the variables are valid and
#'         an error message, otherwise.
#'
#' @export


validateTargetVariables <- function(data, targetVar){

  if(is.character(data)){

    types <- getDataTypes(data,targetVar)

    for(type in types[,"ctype"]){
      if(type != "int" && type != "double"){
        return(.ERROR_TARGET)
      }
    }

    return(.VALID)

  }
  else if(is.data.frame(data)){

    for(var in targetVar){
      if(!is.numeric(data[,targetVar])){
        return(.ERROR_TARGET)
      }
    }

    return(.VALID)

  }

  stop("Parameter 'data' is not valid. It should be a data.frame or a character.")
}
