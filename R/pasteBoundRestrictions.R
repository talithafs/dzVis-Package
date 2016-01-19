#' @title Paste inequality restrictions to a SQL query
#'
#' @description Concatenates inequality restrictions and an existing SQL query string
#'
#' @param query Initial value of the query string. Restrictions are pastet after it.
#' @param tagetVar Variable to be restricted
#' @param min Lower bound for the \code{targetVar}. Should be set to \code{NULL} when not applicable
#' @param max Upper bound for the \code{targetVar}. Should be set to \code{NULL} when not applicable
#' @param whereClause If set to \code{TRUE}, a 'where' clause is inserted before the restrictions
#'                    If set to \code{FALSE}, an 'and' clause is inserted
#'
#' @return The new query string


pasteBoundRestrictions <- function(query, targetVar, min, max, whereClause = TRUE){

  if(whereClause){
    newQuery = paste(query, "where ")
  }
  else {
    newQuery = paste(query, "and ")
  }

  if(!is.null(min) && !is.null(max)){
    newQuery <- paste(newQuery, targetVar, " <= '", max, "' and ", targetVar, " >= '", min, "'", sep="")
  }
  else if(!is.null(max)){
    newQuery <- paste(newQuery, targetVar, " <= '", max, "'", sep="")
  }
  else if(!is.null(min)){
    newQuery <- paste(newQuery, targetVar, " >= '", min, "'", sep="")
  }


  return(newQuery)

}
