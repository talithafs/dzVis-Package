#' @title Paste equality restrictions to a SQL query
#'
#' @description Concatenates equality restrictions and an existing SQL query string
#'
#' @param query Initial value of the query string. Restrictions are pasted after it.
#' @param restrictions n x 2 matrix with n equality restrictions
#' @param whereClause If set to \code{TRUE}, a 'where' clause is inserted before the restrictions.
#'                    If set ot \code{FALSE}, an 'and' clause is inserted
#'
#' @return The new query string

pasteIdRestrictions <- function(query, restrictions, whereClause = TRUE){

  if(whereClause){
    newQuery = paste(query, "where ")
  }
  else {
    newQuery = paste(query, "and ")
  }

  dim = nrow(restrictions)

  for(row in seq_along(1:dim)){
      newQuery <- paste(newQuery, restrictions[row,1], " = '", restrictions[row,2], "' ", sep="")
      if(row != dim){
        newQuery <- paste(newQuery, "and ")
      }
  }

  return(newQuery)

}
