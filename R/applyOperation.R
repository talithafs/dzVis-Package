#' @title Apply an operation on a data.frame
#'
#' @description Applies a pre-defined operation on each row of a data.frame.
#'
#' @param data A \code{data.frame}. The operation will be applied on each of its rows.
#' @param identifier A \code{character}. The operation will be selected according to it.
#'
#' @section Valid identifiers:
#' The operation will be selected according to the following identifiers:
#' \enumerate{
#'    \item Constant .AVG: \code{\link[base]{mean}}
#'    \item Constant .STD: \code{\link[stats]{sd}}
#'    \item Constant .MEDIAN: \code{\link[stats]{median}}
#'}
#'
#' @return A \code{numeric array} containing the results, if the identifier is valid.
#'         An error message, otherwise.

applyOperation <- function(data, identifier){

  if(identifier == .AVG){
    return(apply(data,1,mean))
  }
  else if(identifier == .STD){
    return(apply(data,1,sd))
  }
  else if(identifier == .MEDIAN){
    return(apply(data,1,median))
  }
  else {
    return(.ERROR_OPERATION)
  }

}
