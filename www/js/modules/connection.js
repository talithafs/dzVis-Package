var connection = (function(){
	
	var call = function(functionName, parameters, callback){
		
		var req = ocpu.call(functionName, parameters, function(session){
		        
	    	session.getObject(function(filename){ 
		        	
	        	$.getJSON(session.getFileURL(filename), function(data) {
	        		callback(data.values.join()) ;
	        	});
	        });
		        
 		});

	    req.fail(function(){
	      alert("Server error: " + req.responseText);
    	});
	};
	
	var getAttributeValues = function(attribute, table, nvalues, callback){
		
		var parameters = {
			attribute : attribute,
			table : table,
			nvalues : nvalues 
		} ;
		
		call("getAttributeValues", parameters, callback) ;
	} ;
	
	
	return {
		getAttributeValues : getAttributeValues 
	};
	
})();