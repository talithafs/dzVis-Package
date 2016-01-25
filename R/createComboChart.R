#' @title Create a Google Combo Chart
#'
#' @description Creates a Combo Chart using the googleVis R package
#'
#' @param table A \code{character} value. The name of the table from which the data should be retrieved
#' @param targetVar A \code{character} value. The vertical axis variable
#' @param groupVar A \code{character} value. Variable by which \code{targetVar} should be grouped
#' @param timeVar A \code{character} value. The horizontal axis variable
#' @param min A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Lower bound for the \code{timeVar}
#' @param max A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Upper bound for the \code{timeVar}
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make timeVar and groupVar values unique when combined.
#'
#' @return \code{TRUE} if the chart was successfully created and
#'         \code{FALSE}, otherwise.
#'
#' @section Parameters validation:
#' The parameters are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item targetVar: \code{\link{validateTargetVariable}}
#'    \item groupVar: \code{\link{validateGroupVariables}}
#'    \item timeVar: \code{\link{validateTimeVariable}}
#'    \item min, max, timeVar: \code{\link{validateLimits}}
#'    \item timeVar, groupVar, restrictions: \code{\link{validateKeys}}
#'    \item timeVar, groupVar, targetVar, restrictions: \code{\link{validateConsistency}}
#' }
#'
#' @seealso \code{\link[googleVis]{gvisComboChart}}
#'
#' @export
#' @import DBI
#' @import googleVis

createComboChart <- function(table, targetVar, groupVar, timeVar, min = NULL, max = NULL, restrictions = NULL){

  #connection <- connect()

  #query <- paste("select", targetVar, ",", groupVar, ",", timeVar, "from", table)
  #query <- pasteIdRestrictions(query, restrictions)
  #query <- pasteLimitRestrictions(query, timeVar, min, max, whereClause = FALSE)

  #data <- dbGetQuery(connection, query)
  #disconnect(connection)

  limits <- t(as.matrix(c(timeVar, min, max)))
  data <- importData(table, c(targetVar, groupVar, timeVar), restrictions, limits)

  levels <- levels(as.factor(data[,groupVar]))
  ncolumns <- length(levels) + 1
  nrows <- length(unique(data[,timeVar]))

  newData <- data.frame(matrix(ncol = ncolumns, nrow  = nrows))
  names(newData)[1] <- timeVar
  newData[,1] <- unique(data[,timeVar])

  index = 2

  for(level in levels){
    names(newData)[index] <- level
    newData[,index] <- data[data[,groupVar] == level, targetVar]
    index = index + 1
  }

  graph = gvisComboChart(newData, xvar= 'mes', yvar=names(newData)[2:ncolumns], options=list(seriesType="bars", chartArea = "{width : '65%', left: 0}", width=900))
  plot(graph)

  return(newData)
}
