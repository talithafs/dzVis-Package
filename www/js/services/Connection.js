/**
 * @fileOverview Definition of the Connection service. It provides an API to execute R functions
 * through OpenCPU.
 * @author Talitha Speranza
 * @version 0.1
 */

services.service("connection", function(){ 
	return Connection.getInstance(); 
});

/** @class
 * 	@name Connection
 *  @classdesc An object that makes OpenCPU calls to execute R functions
 */
var Connection = (function() {
	
	/**
 	* Callback definition for getQuery
 	* @callback getQueryCallback
 	* @param {string} data Returned values in a JSON format
 	*/
 	
 	/**
 	* Callback definition for call
 	* @callback callCallback
 	* @param {string} data Returned object. Could be of any type.
 	*/
 	
 	/**
 	* Callback definition for createChart
 	* @callback createChartCallback
 	* @param {string} chartFilePath The name of the .html file where the chart was printed
 	* @param {string} sourceDataPath The name of the .csv file where the source data whas writtem.
 	*/
	
	//Single instance
	var instance ;
	
	// Constructor 
	function Connection(){ }
	
	// Private functions 
	function createInstance() {
        var object = new Connection();
        return object;
    }
	
	/**
	 * @private
	 * @method Connection#getQuery
	 * @description Calls a function that prints the result of a query in a JSON file, which is read and passed to a callback.
	 * @param {string} functionName The name of the R function to be evoked
	 * @param {Object} parameters The parameters of the R function
	 * @param {getQueryCallback} callback The callback that handles the response
	 */ 
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
	
	/**
	 * @private
	 * @method Connection#call
	 * @description Calls a function that returns an object of any type
	 * @param {string} functionName The name of the R function to be evoked
	 * @param {Object} parameters The parameters of the R function
	 * @param {callCallback} callback The callback that handles the response
	 */ 
	var call = function(functionName, parameters, callback){
		
		var req = ocpu.call(functionName, parameters, function(session){
			
			session.getObject(function(data){ callback(data); });
		}) ;
		
		req.fail(function(){
	      alert("Server error: " + req.responseText);
    	});
	
	};
	
	/**
	 * @private
	 * @method Connection#createChart
	 * @description Calls a function that creates a chart
	 * @param {string} functionName The name of the R function to be evoked
	 * @param {Object} parameters The parameters of the R function
	 * @param {createChartCallback} callback The callback that handles the response
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
	
	/** 
	* @method Connection#getColumnValues
	* @description Calls the R function getColumnValues. It gets the top values of a column from a dzVis database table and saves the results in a .json file
	* @param {string} column The name of the column to be selected
	* @param {string} table The name of the table to be selected 
	* @param {string} nvalues The number of values to be selected from the top
	* @param {getQueryCallback} callback The callback that handles the response
	*/
	function getColumnValues(column, table, nvalues, callback){
		
		var parameters = {
			column : column,
			table : table,
			nvalues : nvalues 
		} ;
		
		getQuery("getColumnValues", parameters, callback) ;
	} 
	
	/** 
	* @method Connection#mapChartVariables
	* @description Calls the R function mapChartVariables. It maps which categories chart variables can be assigned to. Minimum and maximum values are also provided when applicable.
	* @param {string} table The name of a dzVis database table containing the variables - the columns - to be analysed.
	* @param {string} variables The name(s) of the column(s)
	* @param {callCallback} callback The callback that handles the response
	*/
	var mapChartVariables = function(table, variables, callback){
		
		var parameters = {
			table : table,
			variables : variables
		};
		
		call("mapChartVariables", parameters, callback);
	} ;
	
	/** 
	* @method  Connection#createGoogleComboChart
	* @description Calls the R function createGoogleComboChart. It creates a Combo Chart using the googleVis R package
	* @param {string} table The name of the table from which the data should be retrieved
	* @param {string} targetVar The name of the column with the vertical axis variable. 
	* @param {string} groupVar The name of the column with the variable by which targetVar should be grouped
	* @param {string} timeVar The name of the column with the horizontal axis variable
	* @param {string} min Lower bound for the timeVar
	* @param {string} max Upper bound for the timeVar
	* @param {string} lineVar The name of the column with the variable that should be used to draw a line according to an operation. 
	* @param {string} operation The operation that should be used to draw the line.
	* @param {number[][]} restrictions A n x 2 matrix. The n equality restrictions that make timeVar and groupVar values unique when combined.
	* @param {number[][]} alternatives A n x 2 matrix. Alternative values of a column (joined by 'or' conditions in a SQL query). The first column must contain the names of the columns. The second, its values
	* @param {createChartCallback} callback The callback that handles the response
	*/
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
	
	/** 
	* @method Connection#createGoogleMotionChart
	* @description Calls the R function createGoogleComboChart
	* @param {string} table The name of the table from which the data should be retrieved
	* @param {string} targetVar The name of the column with the vertical axis variable. 
	* @param {string} groupVar The name of the column with the variable by which targetVar should be grouped
	* @param {string} timeVar The name of the column with the horizontal axis variable
	* @param {string} min Lower bound for the timeVar
	* @param {string} max Upper bound for the timeVar
	* @param {number[][]} restrictions A n x 2 matrix. The n equality restrictions that make timeVar and groupVar values unique when combined.
	* @param {number[][]} alternatives A n x 2 matrix. Alternative values of a column (joined by 'or' conditions in a SQL query). The first column must contain the names of the columns. The second, its values
	* @param {createChartCallback} callback The callback that handles the response
	*/
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