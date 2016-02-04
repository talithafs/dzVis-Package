#' @title Import data from the dzVis database
#'
#' @description Gets data from the dzVis database according to the specified table and columns.
#'              Original column types are set to its equivalents in R.
#'
#' @param table A \code{character}. The name of the table.
#' @param columns A \code{character vector}. The name(s) of the column(s). If all columns should be imported, this argument must be set to \code{*}.
#' @param restrictions A n x 2 \code{matrix}. Equality restrictions. The first column must contain the names of the columns. The second, its values.
#' @param limits A n x 3 \code{matrix}. Inequality restrictions. See the details section for important information.
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{data.frame} with the requested data.
#'
#' @details The \code{limits} matrix must have the following columns
#' \enumerate{
#'    \item targetColumn: A \code{character} value. Column on which restrictions should apply.
#'    \item min: A \code{numeric} value. Lower bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#'    \item max: A \code{numeric} value. Upper bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#' }
#'
#' @section Conversion rules (SQL -> R):
#' \enumerate{
#'    \item \code{enum} -> \code{factor}
#'    \item \code{int} -> \code{integer}
#'    \item \code{double} -> \code{numeric}
#'    \item \code{date} or \code{datetime} -> \code{Date}
#'    \item \code{varchar} -> \code{character}
#' }
#'
#' @import DBI


importData <- function(table, columns, restrictions = NULL, limits = NULL, connection = NULL){

  conn <- connection

  if(is.null(connection)){
    conn <- connect()
  }

  cols <- paste(columns,collapse = ", ")
  query <- paste("select",cols,"from",table)

  if(!is.null(restrictions) && !is.null(limits)) {
    query <- pasteIdRestrictions(query, restrictions)
    query <- pasteLimitRestrictions(query, limits, whereClause = FALSE)
  }
  else if(!is.null(limits)) {
    query <- pasteLimitRestrictions(query, limits)
  }
  else if(!is.null(restrictions)){
    query <- pasteIdRestrictions(query, restrictions)
  }

  data <- dbGetQuery(conn, query)
  types <- getDataTypes(table, columns, conn)

  for(colName in names(data)){
    type = types[types$cod == colName,2]

    if(type == "enum"){
        data[,colName] <- as.factor(data[,colName])
    }
    else if(type == "int"){
      data[,colName] <- as.integer(data[,colName])
    }
    else if(type == "double"){
      data[,colName] <- as.numeric(data[,colName])

    }
    else if(type == "date" || type == "datetime"){
      data[,colName] <- as.Date(data[,colName])
    }
    else if(type == "varchar"){
      data[,colName] <- as.character(data[,colName])
    }
  }

  if(is.null(connection)) {
    disconnect(conn)
  }

  return(data)

}



