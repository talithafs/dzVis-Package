#' @title Get column description alias
#'
#' @description Gets the alias of a column description from a dzVis database table.
#'
#' @param table A \code{character}. The name of the table that contains the target column.
#' @param column A \code{character}. The name of the target column.
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{character}. The alias of the column description.
#'
#' @import DBI

getColumnAlias <- function(table, column, connection = NULL){

  conn <- connection

  if(is.null(connection)){
    conn <- connect()
  }

  query <- paste("select alias from desc_",table," where cod = '",column, "'", sep="")
  alias <- dbGetQuery(conn, query)

  if(is.null(connection)) {
    disconnect(conn)
  }

  return(alias[1,1])

}
