#' @title Connect to the dzVis database
#'
#' @description Connects to the dzVis database and provides a connection object to access it.
#'
#' @return The \code{DBI} connection object to access the dzVis database
#'
#' @details Detailed information about the dzVis database can be found on
#'
#' @seealso \code{\link{disconnect}}
#'
#' @export
#' @import DBI
#' @importFrom RMySQL MySQL


connect <- function(){
  DBI::dbConnect(MySQL(), db = "dzVis",  user = "dzvisuser", host = "179.210.199.47", port=3306)
}
