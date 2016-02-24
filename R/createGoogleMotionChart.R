#' @title Create a Google Combo Chart
#'
#' @description Creates a Combo Chart using the googleVis R package
#'
#' @param table A \code{character}. The name of the table from which the data should be retrieved
#' @param targetVar A \code{character}. The name of the column with the vertical axis variable
#' @param groupVar A \code{character}. The name of the column with the variable by which \code{targetVar} should be grouped
#' @param timeVar A \code{character}. The name of the column with the horizontal axis variable
#' @param min A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Lower bound for the \code{timeVar}
#' @param max A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Upper bound for the \code{timeVar}
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make timeVar and groupVar values unique when combined.
#' @param alternatives A n x 2 \code{matrix}. Alternative values of a column (joined by 'or' conditions in a SQL query). The first column must contain the names of the columns. The second, its values.
#' @param filename A \code{character}. The name of the .html file where the chart should be printed. The extension (.html) is not needed.
#'
#' @return A \code{character vector} if the chart was successfully created, with the name of two files: the .html file where the chart was printed and the .csv file where the source data was saved.
#'         Otherwise, an error string returned by one of validation functions listed under the 'Parameters validation' section.
#'
#' @section Parameters validation:
#' The parameters are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item groupVar: This variable cannot be \code{NULL}.
#'    \item targetVar, groupVar, timeVar, min, max, restrictions: \code{\link{validateGoogleChartParameters}}
#'    \item lineVar: \code{\link{validateTargetVariables}} and \code{\link{validateConsistency}}.
#'    \item lineVar, operation, groupVar: If \code{groupVar} is \code{NULL}, \code{lineVar} must be also \code{NULL}. Besides, \code{operation} cannot be \code{NULL} when \code{lineVar} is not \code{NULL}.
#'}
#'
#' @seealso \code{\link[googleVis]{gvisMotionChart}}
#'
#' @export
#' @import googleVis

createGoogleMotionChart <- function(table, targetVar, groupVar, timeVar, min = NA, max = NA, restrictions = NULL, alternatives = NULL, filename = NULL){

  #-- Process parameters
  if(!is.null(restrictions) && length(restrictions) == 0){
    restrictions <- NULL
  }

  if(!is.null(alternatives) && length(alternatives) == 0){
    alternatives <- NULL
  }

  if(!is.na(min) && min == ""){
    min <- NA
  }

  if(!is.na(max) && max == ""){
    max <- NA
  }

  if(!is.null(groupVar) && groupVar == ""){
    groupVar <- NULL
  }

  #-- Import data
  columns <- c(targetVar, groupVar, timeVar)

  limits <- t(as.data.frame(c(timeVar, min, max)))
  data <- importData(table, columns, restrictions, limits, alternatives)

  #-- Validate parameters
  if(is.null(groupVar)){
    return(.ERROR_GOOGLE_MOTION)
  }

  for(target in targetVar){
    validationMessage <- validateGoogleChartParameters(data, table, target, groupVar, timeVar, min, max, restrictions)

    if(validationMessage != .VALID){
      return(validationMessage)
    }
  }

  #-- Get aliases and rename columns
  targetVar <- getColumnAlias(table,targetVar[1])
  groupVar <- getColumnAlias(table,groupVar)
  timeVar <- getColumnAlias(table, timeVar)

  ncolumns = ncol(data)

  for(index in 1:ncolumns){
    names(data)[index] <- getColumnAlias(table, names(data)[index])
  }

  #-- Set chart options
  options <- list( chartArea = "{width : '68%', left: 0}",
                  width=730,
                  height=320 )


  #-- Create the combo chart and print it
  chartObj = gvisMotionChart(data, idvar = groupVar, timevar= timeVar, yvar= targetVar, options = options)
  chartFile <- printGoogleChart(chartObj, filename)

  #-- Create a csv file with the data that was used
  dataFile <- printChartData(data, chartFile)

  return(c(chartFile,dataFile))
}
