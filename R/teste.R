teste <- function(string){

  createJSONFile(string)

  return("output.json")
}

#function teste(){

#  var req = ocpu.call("teste", {string : "á é í ó ú Á É Í Ó Ú â ê Â ê ã õ Ã Õ"}, function(session){

#    session.getObject(function(data){

#      $scope.sourceURL = session.getFileURL(data) ;
#    });
#  });

#  req.fail(function(){
   # alert("Server error: " + req.responseText);
#  });
#}
