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
	
	/** @function createChart(functionName, parameters, callback)
	* @description Standard function to create charts using opencpu.
	* @param {string} functionName Name of the R function that creates the chart. 
	* @param {Object} parameters Parameters of the R function.
	* @param {function} callback Function that must be executed after the chart is created.
	*/
	var createChart = function(functionName, parameters, callback){
		
		var req = ocpu.call(functionName, parameters, function(session){
			
			session.getObject(function(data){
				
				if(typeof data == "string"){
					callback("ERROR", data);
				}
				else {
					callback(session.getFileURL(data[0]), session.getFileURL(data[1]));
				}
			});
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
	
	var mapChartVariables = function(table, variables, callback){
		
		var parameters = {
			table : table,
			variables : variables
		};
		
		call("mapChartVariables", parameters, callback);
	} ;
	
	var createGoogleComboChart = function(table, targetVar, groupVar, timeVar, min, max, lineVar, operation, restrictions, alternatives, callback){
		
		var parameters = {
			table : table,
			targetVar : targetVar,
			groupVar : groupVar,
			timeVar : timeVar,
			min : min,
			max : max,
			lineVar : lineVar,
			operation : operation,
			restrictions : restrictions,
			alternatives : alternatives 
		};
		
		createChart("createGoogleComboChart", parameters, callback);
	};
	
	var createGoogleMotionChart = function(table, targetVar, groupVar, timeVar, min, max, restrictions, alternatives, callback){
		
		var parameters = {
			table : table,
			targetVar : targetVar,
			groupVar : groupVar,
			timeVar : timeVar,
			min : min,
			max : max,
			restrictions : restrictions,
			alternatives : alternatives 
		};
		
		createChart("createGoogleMotionChart", parameters, callback);
	};
	
	//Connection public API
	Connection.prototype.getColumnValues = function(column, table, nvalues, callback){ 
		getColumnValues.call(this, column, table, nvalues, callback);
	};
	
	Connection.prototype.mapChartVariables = function(table, variables, callback){ 
		mapChartVariables.call(this, table, variables, callback);
	};
	
	Connection.prototype.createGoogleComboChart = function(table, targetVar, groupVar, timeVar, min, max, lineVar, operation, restrictions, alternatives, callback){ 
		createGoogleComboChart.call(this, table, targetVar, groupVar, timeVar, min, max, lineVar, operation, restrictions, alternatives, callback);
	};
	
	Connection.prototype.createGoogleMotionChart = function(table, targetVar, groupVar, timeVar, min, max, restrictions, alternatives, callback){ 
		createGoogleMotionChart.call(this, table, targetVar, groupVar, timeVar, min, max, restrictions, alternatives, callback);
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