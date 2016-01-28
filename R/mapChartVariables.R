#' @title Map chart variables
#'
#' @description Maps which categories chart variables can be assigned to.
#'
#' @param table A \code{character} The name of a dzVis database table containing the variables - the columns - to be analysed.
#' @param variables A \code{character vector} The name(s) of the column(s).
#'
#' @return A \code{data.frame}. The first column represents the names of the variables. The next columns, named after the possible categories, booleans indicating if the variable can be assigned to the category.
#'
#' @section Possible categories:
#' \enumerate{
#'    \item \code{TARGET} Numeric variables. They are typcally represented on the axis of the chart.
#'    \item \code{GROUP} Character variables. Represent categories by which the \code{TARGET} variables are classified.
#'    \item \code{TIME} Date variable. Indicates when the \code{TARGET} were observed.
#' }
#'
#' @section Validation rules:
#' The variables are checked according to the rules estabilished in validation functions and in the following order:
#' \enumerate{
#'    \item targetVar: \code{\link{validateTargetVariables}}
#'    \item groupVar: \code{\link{validateGroupVariable}}
#'    \item timeVar: \code{\link{validateTimeVariable}}
#' }
#'
#' @export

mapChartVariables <- function(table, variables, restrictions = NULL){

  data <- importData(table, variables, restrictions = restrictions)
  nrows <- ncol(data)

  categories <- as.data.frame(matrix(nrow = nrows, ncol = 4))
  names(categories) <- c("column", .TARGET, .GROUP, .TIME)

  for(row in 1:nrows){
    colName <- names(data)[row]
    categories[row,"column"] <- colName

    if(validateTimeVariable(data, colName) == .VALID){
        categories[row,.TIME] <- TRUE
    }
    else {
      categories[row,.TIME] <- FALSE
    }

    if(validateTargetVariables(data, colName) == .VALID){
        categories[row,.TARGET] <- TRUE
    }
    else {
      categories[row,.TARGET] <- FALSE
    }

    if(validateGroupVariable(data, colName) == .VALID){
      categories[row,.GROUP] <- TRUE
    }
    else {
      categories[row,.GROUP] <- FALSE
    }

  }

  return(categories)

}

