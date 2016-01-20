#' @title Disconnect from the dzVis database
#'
#' @description Disconnect from the dzVis database
#'
#' @param connection The \code{DBI} connection object to access the dzVis database
#'
#' @details Detailed information about the dzVis database can be found on
#'
#' @seealso \code{\link{connect}}
#'
#' @export
#' @import DBI

disconnect <- function(connection){
  dbDisconnect(connection)
}
