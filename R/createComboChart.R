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
#' @param alternatives A n x 2 \code{matrix}. Alternative values of a column (joined by 'or' conditions in a SQL query). The first column must contain the names of the columns. The second, its values.
#'
#' @return A \code{character}. The constant \code{.SUCCESS} if the chart was successfully created.
#'         Otherwise, an error string returned by one of validation functions listed under the 'Parameters validation' section.
#'
#' @section Parameters validation:
#' The parameters are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item targetVar, groupVar, timeVar, min, max, restrictions: \code{\link{validateGoogleChartParameters}}
#'    \item lineVar: \code{\link{validateTargetVariables}} and \code{\link{validateConsistency}}
#'}
#'
#' @examples
#' createComboChart("chart","pea_por_idade","percentual_total", "grupo_idade","mes","2010-01-01","2010-05-01", t(as.matrix(c("tipo_area","Total das áreas")))
#'
#' @seealso \code{\link[googleVis]{gvisComboChart}}
#'
#' @export
#' @import googleVis

createComboChart <- function(filename, table, targetVar, groupVar, timeVar, min = NA, max = NA, lineVar = NULL, operation = NULL, restrictions = NULL, alternatives = NULL){

  #-- Process parameters
  if(!is.null(restrictions) && length(restrictions) == 0){
    restrictions <- NULL
  }

  if(!is.null(alternatives) && length(alternatives) == 0){
    alternatives <- NULL
  }

  if(!is.null(lineVar) && lineVar == ""){
    lineVar <- NULL
    operation <- NULL
  }

  if(!is.na(min) && min == ""){
    min <- NA
  }

  if(!is.na(max) && max == ""){
    max <- NA
  }

  #-- Import data
  if(!is.null(lineVar) && lineVar != timeVar){
    columns <- c(columns, lineVar)
  }

  columns <- c(targetVar, groupVar, timeVar)
  limits <- t(as.data.frame(c(timeVar, min, max)))
  data <- importData(table, columns, restrictions, limits, alternatives)

  #-- Validate parameters
  validationMessage <- validateGoogleChartParameters(data, table, targetVar, groupVar, timeVar, min, max, restrictions)

  if(validationMessage != .VALID){
    return(validationMessage)
  }

  if(!is.null(lineVar) && lineVar != targetVar){

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

  }
  else { #groupVar == NULL

    ncolumns <- ncol(data)
    newData <- cbind(data[,timeVar], data[,!(names(data) %in% timeVar)])

    names(newData)[1] <- timeVar

    for(index in 2:ncolumns){
      names(newData)[index] <- getColumnAlias(table, names(newData)[index])
    }
  }

  #-- Set chart options
  options <- list( seriesType="bars",
                   chartArea = "{width : '65%', left: 30}",
                   width=900 )

  #-- Create line
  if(!is.null(lineVar)){

    if(lineVar == targetVar){
      newCol <- apply(newData[2:ncolumns],1,mean)
      name <- operation
    }
    else {
      temp <- matrix(nrow = nrows, ncol = length(levels))
      index = 1

      for(level in levels){
        temp[,index] <- data[data[,groupVar] == level, lineVar]
        index = index + 1
      }

      newCol <- apply(temp,1,mean)
      name <- operation
    }

    newData <- cbind(newData, newCol)
    ncolumns = ncolumns + 1
    names(newData)[ncolumns] <- name
    options <- c(options, series = paste("{", ncolumns - 2,": {type: 'line'}}",sep=""))
  }

  #-- Create the combo chart and print it
  chartObj = gvisComboChart(newData, xvar=timeVar, yvar=names(newData)[2:ncolumns], options=options)
  printGoogleChart(filename,chartObj)

  return(.SUCCESS)
}
