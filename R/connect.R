#' @title Connect to the dzVis database
#'
#' @description Connect to the dzVis database
#'
#' @return The connection string to access the dzVis database
#'
#' @details Detailed information about the dzVis database can be found on
#'
#' @seealso \code{\link{disconnect}}
#'
#' @export
#' @import DBI
#' @import RMySQL


connect <- function(){
  dbConnect(MySQL(), db = "dzVis",  user = "dzvisuser", host = "Talitha-PC", port=3306)
}
