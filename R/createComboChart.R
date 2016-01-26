#' @title Create a Google Combo Chart
#'
#' @description Creates a Combo Chart using the googleVis R package
#'
#' @param filename A \code{character}. The name of the .html file where the chart should be printed. The extension (.html) is not needed.
#' @param table A \code{character} value. The name of the table from which the data should be retrieved
#' @param targetVar A \code{character} value. The vertical axis variable
#' @param groupVar A \code{character} value. Variable by which \code{targetVar} should be grouped
#' @param timeVar A \code{character} value. The horizontal axis variable
#' @param min A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Lower bound for the \code{timeVar}
#' @param max A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Upper bound for the \code{timeVar}
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make timeVar and groupVar values unique when combined.
#'
#' @return \code{TRUE }if the chart was successfully created.
#'         Otherwise, an error string returned by one of validation functions listed under the 'Parameters validation' section.
#'
#' @section Parameters validation:
#' The parameters are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item min, max, timeVar: \code{\link{validateLimits}}
#'    \item timeVar, groupVar, restrictions: \code{\link{validateKeys}}
#'    \item timeVar, groupVar, targetVar, restrictions: \code{\link{validateConsistency}}
#' }
#'
#' @seealso \code{\link[googleVis]{gvisComboChart}}
#'
#' @export
#' @import googleVis

createComboChart <- function(filename, table, targetVar, groupVar, timeVar, min = NULL, max = NULL, restrictions = NULL){

  limits <- t(as.matrix(c(timeVar, min, max)))
  data <- importData(table, c(targetVar, groupVar, timeVar), restrictions, limits)

  if(!is.null(groupVar)) {

    levels <- levels(data[,groupVar])
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
  }
  else { #groupVar == NULL

    ncolumns <- ncol(data)
    newData <- cbind(data[,timeVar], data[,!(names(data) %in% timeVar)])

    connection <- connect()
    names(newData)[1] <- timeVar

    for(index in 2:ncolumns){
      names(newData)[index] <- getColumnAlias(table, names(newData)[index], connection)
    }

    disconnect(connection)
  }

  chartObj = gvisComboChart(newData, xvar=timeVar, yvar=names(newData)[2:ncolumns], options=list(seriesType="bars", chartArea = "{width : '65%', left: 30}", width=900))
  printGoogleChart(filename,chartObj)

  return(TRUE)
}
