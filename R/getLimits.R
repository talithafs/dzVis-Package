#' @title Get limits of a column
#'
#' @description Gets the maximum and minimum value of a column from a dzVis database table.
#'
#' @param table A \code{character}. The name of the table.
#' @param column A \code{character}. The name of the column.
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{data.frame}. The first column contains the minimum value. The second, the maximum.
#'
#' @import DBI
#' @export

getLimits <- function(table, column, connection = NULL){

  conn <- connection

  if(is.null(connection)){
    conn <- connect()
  }

  min <- paste("min(",column,")",sep="")
  max <- paste("max(",column,")",sep="")

  query <- paste("select", min, ",", max, "from", table)
  results <- dbGetQuery(conn, query)

  names(results) <- c(.MIN, .MAX)

  if(is.null(connection)) {
    disconnect(conn)
  }

  return(results)
}
