#' @title Format a Google Chart title
#'
#' @description Generates a meaningful title for a Google Chart, using some parameters that were chosen to create the chart.
#'
#' @param table A \code{character}. The name of the table.
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make timeVar and groupVar values unique when combined.
#' @param targetVar A \code{character}. The name of the column with the vertical axis variable.
#' @param connection A \code{DBI} Connection object if a new connection should not be estabilished.
#'
#' @return A \code{character}. The title that was generated.
#'
#' @import DBI


formatGoogleChartTitle <- function(table, restrictions, targetVar){

  tableName <- toupper(gsub("_"," ",table))
  restValues <- paste(restrictions[,2],collapse=", ")
  targets <- paste(targetVar,collapse=", ")

  title <- paste(tableName, ": ", restValues, " - ", targets, sep="")

  return(title)
}
