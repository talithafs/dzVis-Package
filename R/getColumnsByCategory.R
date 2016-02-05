#' @title Get columns by category
#'
#' @description Gets the column names of all columns that satisfy the criteria to represent a Google Chart category.
#'              This information is retrieved from the corresponding description table in the dzVis database.
#'
#' @param table A \code{character}. The name of the table.
#' @param category A \code{character}. The name of the category.
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{character vector} containing the names of the valid columns.
#'         If the parameter \code{category} is not valid, an error message.
#'
#' @import DBI
#' @export


getColumnsByCategory <- function(table, category, connection = NULL){

  conn <- connection
  columns = NULL

  if(is.null(connection)){
    conn <- connect()
  }

  query <- paste("select cod, ctype from desc_", table, sep="")
  results <- dbGetQuery(conn, query)

  for(col in results[,"cod"]){
    type <- results[results[,"cod"] == col, "ctype"]

    if(category == .TARGET){
      if(type == .DB_INT || type == .DB_DOUBLE)
        columns <- c(columns, col)
    }
    else if(category == .GROUP){
      if(type == .DB_ENUM)
        columns <- c(columns, col)
    }
    else if(category == .TIME){
      if(type == .DB_DATE || type == .DB_DATETIME)
        columns <- c(columns, col)
    }
    else{
      return(.ERROR_CATEGORY)
    }
  }

  if(is.null(connection)) {
    disconnect(conn)
  }

  return(columns)

}
