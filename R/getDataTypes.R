#' @title Get column types
#'
#' @description Gets the data types of table columns. This information is retrieved from the corresponding description table in the dzVis database.
#'
#' @param table A \code{character}. The name of the table.
#' @param columns A \code{character vector}. The name(s) of the column(s).
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{data.frame}. The column \code{cod} contains the columns names. The column \code{ctype}, their types.
#'
#' @import DBI

getDataTypes <- function(table, columns, connection = NULL){

  conn <- connection

  if(is.null(connection)) {
    conn <- connect()
  }

  descTable <- paste("desc_", table, sep="")
  query <- paste("select cod, ctype from", descTable)

  if(columns != .DB_ALL){
    vars <- paste("'", columns, "'", collapse = ", ", sep = "")
    query <- paste("select cod, ctype from", descTable, "where cod in (", vars, ")")
  }

  types <- dbGetQuery(conn, query)

  if(is.null(connection)) {
    disconnect(conn)
  }

  return(types)

}

