#' @title Paste inequality restrictions to a SQL query
#'
#' @description Concatenates inequality restrictions and an existing SQL query string
#'
#' @param query A \code{character} value. Initial value of the query string. Restrictions will be pasted after it.
#' @param restrictions A n x 3 \code{matrix} with n inequality restrictions. See the details section for important information.
#' @param whereClause If set to \code{TRUE}, a 'where' clause is inserted before the restrictions
#'                    If set to \code{FALSE}, an 'and' clause is inserted
#'
#' @details The \code{restrictions} matrix must have the following columns:
#' \enumerate{
#'    \item targetColumn: A \code{character} value. Column on which restrictions should apply.
#'    \item min: A \code{numeric} value. Lower bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#'    \item max: A \code{numeric} value. Upper bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#' }
#'
#' @return A \code{character}. The new query string.


pasteLimitRestrictions <- function(query, restrictions, whereClause = FALSE){

  empty <- 0

  if(whereClause){
    newQuery = paste(query, "where ")
  }
  else {
    newQuery = paste(query, "and ")
  }

  dim = nrow(restrictions)

  for(row in seq_along(1:dim)){

    targetVar <- restrictions[row,1]
    min <- restrictions[row,2]
    max <- restrictions[row,3]

    if(!is.na(min) && !is.na(max)){
      newQuery <- paste(newQuery, targetVar, " <= '", max, "' and ", targetVar, " >= '", min, "'", sep="")
    }
    else if(!is.na(max)){
      newQuery <- paste(newQuery, targetVar, " <= '", max, "'", sep="")
    }
    else if(!is.na(min)){
      newQuery <- paste(newQuery, targetVar, " >= '", min, "'", sep="")
    }
    else {
      empty <- empty + 1
    }

    if(row != dim){
      newQuery <- paste(newQuery, "and ")
    }
  }

  if(empty == nrow(restrictions)){
    return(query)
  }

  return(newQuery)

}
