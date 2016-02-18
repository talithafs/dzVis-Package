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
#' @param alternatives A n x 2 \code{matrix}. Alternative values of a column (joined by 'or' conditions in a SQL query). The first column must contain the names of the columns. The second, its values.
#' @param filename A \code{character}. The name of the .html file where the chart should be printed. The extension (.html) is not needed.
#'
#' @return A \code{character vector} if the chart was successfully created, with the name of two files: the .html file where the chart was printed and the .csv file where the source data was saved.
#'         Otherwise, an error string returned by one of validation functions listed under the 'Parameters validation' section.
#'
#' @section Parameters validation:
#' The parameters are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item targetVar, groupVar, timeVar, min, max, restrictions: \code{\link{validateGoogleChartParameters}}
#'    \item lineVar: \code{\link{validateTargetVariables}} and \code{\link{validateConsistency}}.
#'    \item lineVar, operation, groupVar: If \code{groupVar} is \code{NULL}, \code{lineVar} must be also \code{NULL}. Besides, \code{operation} cannot be \code{NULL} when \code{lineVar} is not \code{NULL}.
#'}
#'
#' @seealso \code{\link[googleVis]{gvisComboChart}}
#'
#' @export
#' @import googleVis

createGoogleComboChart <- function(table, targetVar, groupVar, timeVar, min = NA, max = NA, lineVar = NULL, operation = NULL, restrictions = NULL, alternatives = NULL, filename = NULL){

  #-- Process parameters
  if(!is.null(restrictions) && length(restrictions) == 0){
    restrictions <- NULL
  }

  if(!is.null(alternatives) && length(alternatives) == 0){
    alternatives <- NULL
  }

  if(!is.null(lineVar) && lineVar == ""){
    lineVar <- NULL
  }

  if(!is.null(operation) && operation == ""){
    operation <- NULL
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

  if(!is.null(lineVar) && !(lineVar %in% targetVar)){
    columns <- c(columns, lineVar)
  }

  limits <- t(as.data.frame(c(timeVar, min, max)))
  data <- importData(table, columns, restrictions, limits, alternatives)

  #-- Validate parameters
  validationMessage <- validateGoogleChartParameters(data, table, targetVar, groupVar, timeVar, min, max, restrictions)

  if(validationMessage != .VALID){
    return(validationMessage)
  }

  if(!is.null(lineVar) && !(lineVar %in% targetVar)){

    if(is.null(groupVar)){
      return(.ERROR_GOOGLE_COMBO_1)
    }

    if(is.null(operation)){
      return(.ERROR_GOOGLE_COMBO_2)
    }

    validationMessage <- validateTargetVariables(data,lineVar)

    if(validationMessage != .VALID){
      return(validationMessage)
    }

    validationMessage <- validateConsistency(data,timeVar,groupVar,lineVar)

    if(validationMessage != .VALID){
      return(validationMessage)
    }

  }

  #-- Create a dataset in which each column is either a time variable or a category with target values
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

    target <- getColumnAlias(table, targetVar)

  }
  else { #groupVar == NULL

    ncolumns <- ncol(data)
    newData <- cbind(data[,timeVar], data[,!(names(data) %in% timeVar)])

    names(newData)[1] <- timeVar

    for(index in 2:ncolumns){
      names(newData)[index] <- getColumnAlias(table, names(newData)[index])
    }

    target <- names(newData)[2:ncolumns]
  }

  ### should write a function to set an appropriate title
  title = formatGoogleChartTitle(table, restrictions, target)

  #-- Set chart options
  options <- list( title = title,
                   seriesType="bars",
                   chartArea = "{width : '72%', left: 30}",
                   width=750,
                   height=320 )

  #-- Create line
  if(!is.null(operation)){

    if(lineVar == targetVar || is.null(groupVar)){
      newCol <- applyOperation(newData[2:ncolumns],operation)
    }
    else {
      temp <- matrix(nrow = nrows, ncol = length(levels))
      index = 1

      for(level in levels){
        temp[,index] <- data[data[,groupVar] == level, lineVar]
        index = index + 1
      }

      newCol <- applyOperation(temp,operation)
    }

    name <- paste(operation, ": ", getColumnAlias(table,lineVar), sep="")
    newData <- cbind(newData, newCol)
    ncolumns = ncolumns + 1
    names(newData)[ncolumns] <- name
    options <- c(options, series = paste("{", ncolumns - 2,": {type: 'line'}}",sep=""))
  }

  #-- Create the combo chart and print it
  chartObj = gvisComboChart(newData, xvar=timeVar, yvar=names(newData)[2:ncolumns], options=options)
  chartFile <- printGoogleChart(chartObj, filename)

  #-- Create a csv file with the data that was used
  dataFile <- printChartData(newData,chartFile)

  return(c(chartFile,dataFile))
}
