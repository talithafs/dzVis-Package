#' @title Create a Google Combo Chart
#'
#' @description Creates a Combo Chart using the googleVis R package
#'
#' @param table The name of the table from which the data should be retrieved
#' @param targetVar The numeric value of interest: the vertical axis variable
#' @param groupVar Variable by which \code{targetVar} should be grouped
#' @param timeVar The horizontal axis variable
#' @param min Lower bound for the \code{timeVar}
#' @param max Upper bound for the \code{timeVar}
#' @param restrictions n x 2 matrix containing the n equality restrictions that make timeVar and groupVar unique when combined.
#'
#' @section Validation rules:
#' \enumerate{
#'    \item Ola hahaha
#'    \item Hue olaaa
#' }
#'
#'
#' @return \code{TRUE} if the chart was successfully created and
#'         \code{FALSE} otherwise
#'
#' @seealso \code{googleVis}
#'
#' @export
#' @import DBI

createComboChart <- function(table, targetVar, groupVar, timeVar, min = NULL, max = NULL, restrictions = NULL){

  connection <- connect()

  query <- paste("select", targetVar, ",", groupVar, ",", timeVar, "from", table)
  query <- pasteIdRestrictions(query, restrictions)
  query <- pasteBoundRestrictions(query, timeVar, min, max, whereClause = FALSE)

  data <- dbGetQuery(connection, query)
  disconnect(connection)

  levels <- levels(as.factor(data[,groupVar]))
  ncolumns <- length(levels) + 1
  nrows <- length(unique(data[,timeVar]))

  newData <- data.frame(matrix(ncol = ncolumns, nrow  = nrows))
  names(newData)[1] <- timeVar
  newData[,1] <- unique(data[,timeVar])

  index = 2

  for(level in levels){
    names(newData)[index] <- level
    currentLevel <- data[,groupVar]
    newData[,index] <- data[currentLevel == level, targetVar]
    index = index + 1
  }

  graph = gvisComboChart(newData, xvar= timeVar, yvar=names(newData)[2:length(levels)], options=list(seriesType="bars"))
  plot(graph)

  return(newData)
}
