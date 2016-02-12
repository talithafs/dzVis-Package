#' @title Validate the parameters of a Google Chart
#'
#' @description Checks if the chosen parameters follows the validation rules for a Google Chart.
#'              It uses a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame}. The data source.
#' @param table A \code{character} value. The name of the table from which the data was retrieved.
#' @param targetVar A \code{character vector}. The name(s) of the column(s) with the target variable(s) values.
#' @param groupVar A \code{character}. The name of the column with the group variable.
#' @param timeVar A \code{character}. The name of the column with the time variable.
#' @param min A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Lower bound for the \code{timeVar}
#' @param max A \code{numeric} value or a \code{date string} in the format 'yyyy-mm-dd'. Upper bound for the \code{timeVar}
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make timeVar and groupVar values unique when combined.

#'
#' @section Validation rules:
#' \enumerate{
#'    \item min, max, timeVar: \code{\link{validateLimits}}
#'    \item timeVar, groupVar, restrictions: \code{\link{validateKeys}}
#'    \item timeVar, groupVar, targetVar, restrictions: \code{\link{validateConsistency}}
#' }
#'
#' @return A \code{character}. The constant \code{.VALID} if the parameters are and
#'         an error message, otherwise.
#'
#' @export

validateGoogleChartParameters <- function(data, table, targetVar, groupVar, timeVar, min, max, restrictions){

  if(!is.na(min) || !is.na(max)){
    validationMessage <- validateLimits(data,timeVar,as.Date(min),as.Date(max))

    if(validationMessage != .VALID){
      return(validationMessage)
    }
  }

  validationMessage <- validateKeys(table, c(timeVar,groupVar,restrictions[,1]))

  if(validationMessage != .VALID){
    return(validationMessage)
  }

  validationMessage <- validateConsistency(data, timeVar, groupVar, targetVar)


  if(validationMessage != .VALID){
    return(validationMessage)
  }

  return(.VALID)
}
