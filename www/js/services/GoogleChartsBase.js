services.service("googlecharts", ["databasetree", "connection", function(databaseTree, connection){
	return GoogleChartsBase.getInstance(databaseTree, connection);
}]);

var GoogleChartsBase = (function() {
	
	// Single instance
	var instance ;
	
	// Instance variables 
	this.databaseTree = undefined ;
	this.connection = undefined ;
	
	// Private variables
	var currentTable = undefined ;
	var currentColumns = undefined ;
	var validationMatrix = undefined ;
	var currentTimeVariable = undefined ;
	
	var lastCheckedId = "" ;
	
	// Protected constants: Fields default values
	var DEFAULT = {
		get TARGET() {
			return [{id : null, name: null, text : "Nenhuma"}] ;
		},
		get GROUP() {
			return [{id : null, name: null, text : "Não agrupar"}] ;
		},
		get TIME() {
			return {id : null, name: null, text : "Nenhuma"} ;
		}
	};
	
	// Protected constants: Labels 
	var LABEL = {
		get MULTIPLE_DATES(){
			return "Selecionar múltiplas datas" ;
		},
		get INTERVAL(){
			return "Selecionar intervalo" ;
		},
		get TARGET(){
			return "Variáveis numéricas" ; 
		},
		get GROUP(){
			return "Agrupar por" ;
		},
		get TIME(){
			return "Variável temporal";
		},
		get FILTERS(){
			return "Filtros" ;
		},
		get MIN_DATE(){
			return "Início:" ;
		},
		get MAX_DATE(){
			return "Fim:" ;
		} 
	};

	// Protected constants: Placeholders 
	var PLACEHOLDER = {
		get MULTIPLE_DATES(){
			return "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas" ;
		}
	};
	
	// Protected variables
	var properties = {
		get timeVariable(){
			return currentTimeVariable ;
		},
		get table(){
			return currentTable ;
		},
		get columns(){
			return currentColumns ;
		}
	};
	
	// Constructor
	function GoogleChartsBase(databaseTree, connection) {
		
		// Initialize instance variables
		this.databaseTree = databaseTree ;
		this.connection = connection ;
	}
	
	// Private functions
	function createInstance(databaseTree, connection) {
        var object = new GoogleChartsBase(databaseTree, connection);
        return object;
    }
	
	// Protected functions 
	function onNodeChecked(node, callback){
		
		if(node != undefined){

			var table = this.databaseTree.getTable(node) ;
			
			if(table != currentTable){
				currentTable = table ;
				currentTimeVariable = undefined ;
				currentColumns = [] ;
				lastCheckedId = "" ;
				
			}

			if(node.id != lastCheckedId){
				
				var colName = this.databaseTree.getColumn(node).name ;
				var found = [] ;
				
				found = jQuery.map(currentColumns, function(obj){
					if(obj.name === colName){ return obj ; }
				});
				
				if(found.length == 0){
					
					var addCols = function(data){

						node.categories = data[0];
						currentColumns.push(node);
						callback();
					};
					
					this.connection.mapChartVariables(table.id, colName, addCols) ;
				}
			}
			
			lastCheckedId = node.id ;
		}	
	};
	
	
	function findTimeVariable(callback){
		
		var dbTree = this.databaseTree ;
		
		if(currentTable != undefined){

			this.connection.getColumnsByCategory(currentTable.id, "TIME", function(timeVar){
				
				var treeNode = dbTree.getNode(currentTable.id + "." + timeVar) ;
				dbTree.properties.treeInstance.disable_node(treeNode);

				// have to uncheck tree node and change its icon when disabled (it wont count as checked, if it was checked by the user before)
				// have to find a way of re-enableing it when changing views, in case its not a google chart
				// have enrich the databaseTree interface
				// the null thing in fillOptions is not working
				
				// alert(JSON.stringify(treeNode));
				
				currentTimeVariable = treeNode.original ;
				callback(currentTimeVariable);
			});
		}
	}
	
	function getCategories(column){
		
		if(column == undefined){
			return "Error: Column name is undefined.";
		}
		
		var found = jQuery.map(validationMatrix, function(obj){
						if(obj.column === column){ return obj ; }
					});
					
		return found[0];
	}

	
	// GoogleChartsBase public API
	GoogleChartsBase.prototype.DEFAULT = DEFAULT ;
	GoogleChartsBase.prototype.LABEL = LABEL ;
	GoogleChartsBase.prototype.PLACEHOLDER = PLACEHOLDER ;
	GoogleChartsBase.prototype.properties = properties ;
	
	GoogleChartsBase.prototype.onNodeChecked = function(node, callback){ 
		onNodeChecked.call(this,node,callback); 
	};
	
	GoogleChartsBase.prototype.findTimeVariable = function(callback){
		findTimeVariable.call(this,callback); 
	};
	
	GoogleChartsBase.prototype.getCategories = function(column){
		return getCategories.call(this,column);
	};
	
	return {
        getInstance: function (databaseTree, connection) {
            if (!instance) {
                instance = createInstance(databaseTree, connection);
            }
            return instance;
        }
    };
}());


	
	
	

