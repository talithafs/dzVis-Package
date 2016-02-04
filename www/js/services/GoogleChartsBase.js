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
	var validationMatrix = undefined ;
	var lastCheckedId = "" ;
	
	// Protected constants: Fields default values
	var DEFAULT = {
		get TARGET() {
			return [{id : null, text : "Nenhuma"}] ;
		},
		get GROUP() {
			return [{id : null, text : "Não agrupar"}] ;
		},
		get TIME() {
			return {id : null, text : "Nenhuma"} ;
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
		get validationMatrix(){
			return validationMatrix ;
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
	function onTreeClicked(e, checked){
		
		var dim = checked.length ; 
		
		if(checked[dim-1] != undefined){
			
			var justChecked = checked[dim-1] ;
			var table = this.databaseTree.getTable(justChecked) ;
			
			if(table != currentTable){
				currentTable = table ;
				validationMatrix = [] ;
				lastCheckedId = "" ;
			}
			
			if(justChecked.id != lastCheckedId){
				
				var column = this.databaseTree.getColumn(justChecked).name ;
				var found = [] ;
				
				found = jQuery.map(validationMatrix, function(obj){
					if(obj.column === column){ return obj ; }
				});
				
				if(found.length == 0){
					
					var callback = function(data){
						validationMatrix.push(data[0]);
						//alert(JSON.stringify(validationMatrix));
					};
					
					this.connection.mapChartVariables(table.id, column, callback) ;
				}
				
			}
			
			lastCheckedId = justChecked.id ;
		}	
	};
	
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
	
	GoogleChartsBase.prototype.onTreeClicked = function(e,instance){ 
		onTreeClicked.call(this,e,instance); 
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


	
	
	

