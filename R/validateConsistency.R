#' @title Validate consistency between chart parameters
#'
#' @description Checks if the chosen parameters follows the consistency rules.
#'              It uses a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame}. The data source.
#' @param timeVar A \code{character}. The name of the column with the time variable.
#' @param groupVar A \code{character}. The name of the column with the group variable.
#' @param targetVar A \code{character vector}. The name(s) of the column(s) with the target variable(s) values.
#'
#' @section Consistency rules:
#' \enumerate{
#'    \item If \code{targetVar} has more than one element, \code{groupVar} must be \code{NULL}. Otherwise, \code{groupVar} must be a \code{factor} in R and \code{enum} in the database.
#'    \item If \code{groupVar} IS NOT \code{NULL}, each of its categories must have non null \code{targetVar} values corresponding to each different \code{timeVar} value. Besides, the set of different \code{timeVar} values must be the same for each category in \code{groupVar}.
#'    \item If \code{groupVar} IS \code{NULL}, each \code{targetVar} column must contain non null values corresponding to each different \code{timeVar} value. Besides, the set of different \code{timeVar} values must be the same for each \code{targetValue}.
#' }
#'
#' @return A \code{character}. The constant \code{.VALID} if variables are consistent and
#'         an error message, otherwise.
#'
#' @export

validateConsistency <- function(data, timeVar, groupVar, targetVar){

    if(length(targetVar) != 1 && !is.null(groupVar)){
      return(.ERROR_CONSISTENCY_1)
    }

    timeValues <- sort(unique(data[,timeVar]))
    dim <- length(timeValues)

    if(!is.null(groupVar) && is.factor(data[,groupVar])){

      levels <- levels(groupVar)

      for(level in levels){
        timeValuesByGroup <- data[data[,groupVar] == level,timeVar]

        if(length(timeValuesByGroup) != dim){
          return(.ERROR_CONSISTENCY_2)
        }

        if(!identical(timeValues, sort(timeValuesByGroup))){
          return(.ERROR_CONSISTENCY_3)
        }
      }

      return(.VALID)
    }
    else if(is.null(groupVar)) {

      levels <- targetVar

      for(level in levels){
        timeValuesByGroup <- data[,level]

        if(length(timeValuesByGroup) != dim){
          return(.ERROR_CONSISTENCY_2)
        }
      }

      return(.VALID)
    }

    return(.ERROR_CONSISTENCY_1)
}
