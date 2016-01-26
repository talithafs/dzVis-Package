#' @title Validate the limits imposed on a column
#'
#' @description Checks the validity of inequality restrictions imposed on a column.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param columnName A \code{character}. The name of the column to be checked.
#' @param min A \code{numeric} value, a \code{character} or a \code{Date} in the format 'yyyy-mm-dd'. Lower bound for the column value. Should be set to \code{NULL} when not applicable.
#' @param max A \code{numeric} value, a \code{character} or a \code{Date} in the format 'yyyy-mm-dd'. Upper bound for the column value. Should be set to \code{NULL} when not applicable.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item \code{min} and \code{max} must be of the same type: both \code{numeric} or both \code{character}.
#'    \item \code{min} must be less than \code{max}
#'    \item If \code{min} and \code{max} type is \code{numeric}, the column values must also be \code{numeric} in R and \code{int} or \code{double} in the database.
#'    \item If \code{min} and \code{max} type is \code{character}, the column values must be \code{character} in R and \code{varchar} in the database.
#'    \item If \code{min} and \code{max} type is \code{Date}, the column values must be \code{Date} in R and \code{date} or \code{datetime} in the database.
#' }
#'
#' @return The constant \code{.VALID} if the limits are valid.
#'         An error message, otherwise.
#'
#' @export

validateLimits <- function(data, columnName, min, max){

  if(class(min) != class(max)){
    return(.ERROR_LIMITS_1)
  }
  else if(!is.character(min) && !is.numeric(min) && class(min) != "Date"){
    return(.ERROR_LIMITS_2)
  }
  else if(min >= max){
    return(.ERROR_LIMITS_3)
  }

  matches <- TRUE

  if(is.character(data)){

    type <- getDataTypes(data, columnName)[1,"ctype"]

    if(is.character(min)){
      matches <- grepl("^varchar", type)
    }
    else if(class(min) == "Date"){
      matches <- type == "date" || type == "datetime"
    }
    else if(is.numeric(min)){
      matches <- type == "int" || type == "double"
    }

    if(!matches){
      return(.ERROR_LIMITS_4)
    }
    else{
      return(.VALID)
    }
  }
  else if(is.data.frame(data)){

    if(is.character(min)){
      matches <- is.character(data[,columnName])
    }
    else if(class(min) == "Date"){
      matches <- class(data[,columnName]) == "Date"
    }
    else if(is.numeric(min)){
      matches <- is.numeric(data[,columnName])
    }

    if(!matches){
      return(.ERROR_LIMITS_4)
    }
    else{
      return(.VALID)
    }

  }

  stop("Parameter 'data' is not valid. It should be a data.frame or a character.")

}
