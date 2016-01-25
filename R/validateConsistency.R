#' @title Validate consistency between chart parameters
#'
#' @description Checks if the chosen parameters follows the consistency rules.
#'              It uses a direct connection to the dzVis database or a \code{data.frame} as the data source.
#'
#' @param data A \code{data.frame} with the actual data source or a \code{character} containing the name of the table in the dzVis database.
#'             If it is a \code{data.frame}, a connection to the dzVis database WILL NOT be estabilished.
#'             If it is a \code{character}, a connection WILL be estabilished.
#' @param timeVar A \code{character}. The name of the column with the time variable values.
#' @param groupVar A \code{character vector}. The name(s) of the column(s) with the group variable(s).
#' @param targetVar A \code{character}. The name of the column with the target variable values.
#' @param restrictions A n x 2 \code{matrix}. The n equality restrictions that make \code{keys} unique.
#' @param limits A n x 3 \code{matrix}. Inequality restrictions. See the details section for important information.
#'
#' @details The \code{limits} matrix must have the following columns:
#' \enumerate {
#'    \item targetColumn: A \code{character} value. Column on which restrictions should apply.
#'    \item min: A \code{numeric} value. Lower bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#'    \item max: A \code{numeric} value. Upper bound for the \code{targetColumn}. Should be set to \code{NA} when not applicable.
#' }
#'
#' @section Consistency rules:
#' \enumerate{
#'    \item If \code{groupVar} is a \code{factor}, \code{targetVar} must be \code{NULL}.
#'    \item Each category in \code{groupVar} must have non null \code{targetVar} values corresponding to each different \code{timeVar} value.
#'    \item The set of different \code{timeVar} values must be the same for each category in \code{groupVar}.
#' }
#'
#' @return \code{TRUE} if variables are consistent and
#'         \code{FALSE}, otherwise.
#'
#' @export
#' @import DBI

validateConsistency <- function(data, timeVar, groupVar, targetVar, restrictions = NULL, limits = NULL){

    if(is.character(data)){
      data <- importData(data, c(timeVar, groupVar, targetVar), restrictions, limits)
    }
    else if(is.data.frame(data)){

      if(!is.null(restrictions)){
        columns <- restrictions[,1]

        for(column in columns){
          value <- restrictions[columns == column,2]
          data <- data[data[,column] == value,]
        }
      }

      data <- data[,c(timeVar, groupVar, targetVar)]
    }

    if(is.factor(groupVar) && !is.null(targetVar)){
      return(FALSE)
    }

    if(is.factor(groupVar)){



    }


    return(TRUE)
}
