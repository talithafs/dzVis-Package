#' @title Format dates
#'
#' @description xxxxxxxxxx
#'
#' @param table xxxxxxxxxx
#' @param dates xxxxxxxxxxx
#' @param toStandard xxxxxxxxxx
#' @param connection xxxxxxx
#'
#' @return xxxxxxx
#'
#' @import DBI
#' @import zoo


formatDates <- function(table, dates, toStandard = TRUE, connection = NULL){

  conn <- connection

  if(is.null(connection)){
    conn <- connect()
  }

  if(length(dates) == 0){
    return(dates)
  }

  query <- paste("select frequencia_dados from tabelas where nome='",table,"'", sep='')
  results <- dbGetQuery(conn, query)
  freq <- results[[1]]

  if(toStandard){

    if(class(dates) == "Date" || freq == "diaria"){
      return(dates)
    }

    length <- length(dates)

    for(index in 1:length){

      if(!is.na(dates[index])){

        if(freq == "mensal"){

          date <- as.yearmon(dates[index])
          month = as.character(format(date, "%m"))
          year = format(date, "%Y")

          dates[index] <- paste(year,"-",month,"-01",sep="")
        }
        else if(freq == "anual"){

          dates[index] <- paste(dates[index],"-01-01",sep="")
        }
      }
    }

    if(is.null(connection)) {
      disconnect(conn)
    }

    return(dates)
  }
  else {

    if(freq == "diaria"){
      return(dates)
    }

    length <- length(dates)

    for(index in 1:length){

      if(!is.na(dates[index])){

        date <- as.yearmon(dates[index])

        if(freq == "anual"){
          dates[index] <- format(date,"%Y")
        }
        else if(freq == "mensal"){
          month = as.character(format(date, "%m"))
          year = format(date, "%Y")
          dates[index] <- paste(year,"-",month,sep="")
        }
      }
    }

    if(is.null(connection)) {
      disconnect(conn)
    }

    return(dates)
  }

}
