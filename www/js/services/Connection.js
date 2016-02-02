services.service("connection", function(){ 
	return Connection.getInstance(); 
});

var Connection = (function() {
	
	//Single instance
	var instance ;
	
	// Constructor 
	function Connection(){ }
	
	// Private functions 
	function createInstance() {
        var object = new Connection();
        return object;
    }
	
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
	
	// Protected functions
	var getColumnValues = function(column, table, nvalues, callback){
		
		var parameters = {
			column : column,
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
	
	//Connection public API
	Connection.prototype.getColumnValues = function(column, table, nvalues, callback){ 
		getColumnValues.call(this, column, table, nvalues, callback);
	};
	
	Connection.prototype.mapChartVariables = function(table, variables, restrictions, callback){ 
		mapChartVariables.call(this, table, variables, restrictions, callback);
	};
	
	Connection.prototype.validateKeys = function(table, keys, restrictions, callback){ 
		validateKeys.call(this, table, keys, restrictions, callback);
	};
	
	Connection.prototype.createComboChart = function(filename, table, targetVar, groupVar, timeVar, min, max, restrictions, callback){ 
		createComboChart.call(this, filename, table, targetVar, groupVar, timeVar, min, max, restrictions, callback);
	};
	
	return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}());