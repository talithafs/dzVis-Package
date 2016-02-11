.WAMP_DIR = "C:\\Users\\Talitha\\Dropbox\\Economia\\Projeto Final\\R Package\\dzVis\\www\\"
.PACKAGE_DIR = "C:\\Users\\Talitha\\Documents\\R\\win-library\\3.2\\dzVis\\"

.WAMP_DIR_ALT =  "C:\\Users\\Alex\\Desktop\\Projetos\\Projeto Final\\R Package\\www\\"
.PACKAGE_DIR_ALT = "C:\\Users\\Alex\\Documents\\R\\win-library\\3.2\\dzVis\\"

updateFrontEnd <- function(run = TRUE){
  wamp <- .WAMP_DIR
  dzvis <- .PACKAGE_DIR
  www <- paste(dzvis, "\\www", sep="")

  if(file.exists(www)) {
    unlink(www, recursive = TRUE)
  }

  file.copy(wamp,dzvis,recursive=TRUE)

  if(run){
    run()
  }
}

rebuild <- function(run = TRUE, install = TRUE, doc = TRUE){
  wamp <- .WAMP_DIR
  dzvis <- .PACKAGE_DIR
  www <- paste(dzvis, "\\www", sep="")

  if(file.exists(www)) {
    unlink(www, recursive = TRUE)
  }

  if(doc){
    require(roxygen2)
    roxygen2::roxygenise()
  }

  require(devtools)
  devtools::build()

  if(install){
    devtools::install()
  }

  file.copy(wamp,dzvis,recursive=TRUE)

  if(run){
    run()
  }

}

run <- function(){
  require(opencpu)
  if(is.null(opencpu$url())){
    opencpu$start()
  }
  else{
    opencpu$restart()
  }
  opencpu$browse("/library/dzVis/www")
}


