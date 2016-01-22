services.service("connection", Connection);

function Connection() {
	
	var reqFile = function(functionName, parameters, callback){
		
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
	
	var call = function(functionName, parameters, callback){
		
		var req = ocpu.call(functionName, parameters, function(session){
			
			session.getObject(function(data){ callback(data); });
		}) ;
		
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
		
		reqFile("getAttributeValues", parameters, callback) ;
	} ;
	
	var validateKeys = function(table, keys, restrictions, callback){
		
		var parameters = {
			data : table,
			keys : keys,
			restrictions : restrictions
		};
		
		call("validateKeys", parameters, callback);
		
	};
	
	
	return {
		getAttributeValues : getAttributeValues,
		validateKeys : validateKeys 
	};
	
}