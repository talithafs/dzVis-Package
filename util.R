updateFrontEnd <- function(){
  wamp <- "C:\\Users\\Talitha\\Dropbox\\Economia\\Projeto Final\\R Package\\dzVis\\www\\"
  dzvis <- "C:\\Users\\Talitha\\Documents\\R\\win-library\\3.2\\dzVis\\"
  www <- paste(dzvis, "\\www", sep="")

  if(file.exists(www)) {
    unlink(www, recursive = TRUE)
  }

  file.copy(wamp,dzvis,recursive=TRUE)
}
