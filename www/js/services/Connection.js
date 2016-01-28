services.service("connection", Connection);

function Connection() {
	
	var getQuery = function(functionName, parameters, callback){
		
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
	
	var createChart = function(functionName, parameters, callback){
		
		var req = ocpu.call(functionName, parameters, function(session){
			
			callback(session.getFileURL(parameters.filename));
		});
		
		req.fail(function(){
	      alert("Server error: " + req.responseText);
    	});
	};
	
	var getColumnValues = function(attribute, table, nvalues, callback){
		
		var parameters = {
			attribute : attribute,
			table : table,
			nvalues : nvalues 
		} ;
		
		getQuery("getColumnValues", parameters, callback) ;
	} ;
	
	var mapChartVariables = function(table, variables, restrictions, callback){
		
		var parameters = {
			table : table,
			variables : variables,
			restrictions : restrictions 
		};
		
		call("mapChartVariables", parameters, callback);
	} ;
	
	var validateKeys = function(table, keys, restrictions, callback){
		
		var parameters = {
			data : table,
			keys : keys,
			restrictions : restrictions
		};
		
		call("validateKeys", parameters, callback);
		
	};
	
	var createComboChart = function(filename, table, targetVar, groupVar, timeVar, min, max, restrictions, callback){
		
		var parameters = {
			filename : filename,
			table : table,
			targetVar : targetVar,
			groupVar : groupVar,
			timeVar : timeVar,
			min : min,
			max : max,
			restrictions : restrictions
		};
		
		createChart("createComboChart", parameters, callback);
	};
	
	return {
		getColumnValues : getColumnValues,
		validateKeys : validateKeys,
		mapChartVariables : mapChartVariables,
		createComboChart : createComboChart 
	};
	
}