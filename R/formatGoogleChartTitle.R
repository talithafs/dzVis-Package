formatGoogleChartTitle <- function(table, restrictions, targetVar){

  tableName <- toupper(gsub("_"," ",table))
  restValues <- paste(restrictions[,2],collapse=", ")
  targets <- paste(targetVar,collapse=", ")

  title <- paste(tableName, ": ", restValues, " - ", targets, sep="")

  return(title)
}
