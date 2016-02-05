services.service("googlecharts", ["$state", "databasetree", "connection", function(state, databaseTree, connection){
	return GoogleChartsBase.getInstance(state, databaseTree, connection);
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
	function GoogleChartsBase(state, databaseTree, connection) {
		
		// Initialize instance variables
		this.databaseTree = databaseTree ;
		this.connection = connection ;
		this.state = state ;
	}
	
	// Private functions
	function createInstance(state, databaseTree, connection) {
        var object = new GoogleChartsBase(state, databaseTree, connection);
        return object;
    }
	
	// Protected functions
	function onLoad(callback){
		
		if(currentColumns != undefined){
			callback(currentColums);
		}
		else {
			
			// implementar getCheckedColumns
			var checked = this.databaseTree.getCheckedColumns() ;

			if(checked.length != 0){
				
				// pegar o nome da tabela e preencher currentTable
			
				for(index in checked){
					
					// fazer uma lista com os NOMES das colunas
					// pegar os nós enquanto isso e preencher currentColumns com eles
				}
				
				// chamar mapChartVariables com a lista de colunas e o nome da tabela
				// preencher currentColumns[x].categories com o resultado do mapping, via callback
				
				// pegar a variavel temporal e prencher currentTimeVar
				
				// chamar o callback passando currentColumns - callback do getTimeVar
			}
		}
		
	}
	
	 
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
	
	function onDestroy(){
		
		if(this.state.current.data.type != "googlevis"){
			
			currentTable = undefined ;
			currentColumns = undefined ;
			lastCheckedId = "" ;
			
			if(currentTimeVariable != undefined){
				this.databaseTree.enableCheckbox(currentTimeVariable.id);
			}
			
			currentTimeVariable = undefined ;
		}
	}
	
	
	function findTimeVariable(callback){
		
		var dbTree = this.databaseTree ;
		
		if(currentTable != undefined){
			
			this.connection.getColumnsByCategory(currentTable.id, "TIME", function(timeVar){
				
				var id = currentTable.id + "." + timeVar ;
				dbTree.disableCheckbox(id) ;
				
				currentTimeVariable = dbTree.getOriginalNode(id) ;
				callback(currentTimeVariable);
			});
		}
	}
	
	// function getCategories(column){
// 		
		// if(column == undefined){
			// return "Error: Column name is undefined.";
		// }
// 		
		// var found = jQuery.map(currentColumns, function(obj){
						// if(obj.name === column){ return obj ; }
					// });
// 					
		// return found[0];
	// }

	
	// GoogleChartsBase public API
	GoogleChartsBase.prototype.DEFAULT = DEFAULT ;
	GoogleChartsBase.prototype.LABEL = LABEL ;
	GoogleChartsBase.prototype.PLACEHOLDER = PLACEHOLDER ;
	GoogleChartsBase.prototype.properties = properties ;
	
	GoogleChartsBase.prototype.onNodeChecked = function(node, callback){ 
		onNodeChecked.call(this,node,callback); 
	};
	
	GoogleChartsBase.prototype.onDestroy = function(){
		onDestroy.call(this);
	};
	
	GoogleChartsBase.prototype.findTimeVariable = function(callback){
		findTimeVariable.call(this,callback); 
	};
	
	// GoogleChartsBase.prototype.getCategories = function(column){
		// return getCategories.call(this,column);
	// };
	
	
	return {
        getInstance: function (state, databaseTree, connection) {
            if (!instance) {
                instance = createInstance(state, databaseTree, connection);
            }
            return instance;
        }
    };
}());


	
	
	

