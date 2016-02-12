services.service("googlecharts", ["$state", "databasetree", "connection", function(state, databaseTree, connection){
	return GoogleChartsBase.getInstance(state, databaseTree, connection);
}]);

var GoogleChartsBase = (function() {
	
	// Single instance
	var instance ;
	
	// Reference
	var ref ;
	
	// Instance variables 
	this.databaseTree = undefined ;
	this.connection = undefined ;
	
	// Private variables
	var currentTable = undefined ;
	var currentColumns = [] ;
	var currentTimeVariable = undefined ;
	var categories = [] ;
	var filters = [] ;
	var keys ;
	
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
		},
		get NO_VALUE(){
			return {id: null, text: "Nenhum valor selecionado"} ;
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
		},
		get filters(){
			return filters ;
		}
	};
	
	// Constructor
	function GoogleChartsBase(state, databaseTree, connection) {
		
		// Initialize instance variables
		this.databaseTree = databaseTree ;
		this.connection = connection ;
		this.state = state ;
		ref = this ;
	}
	
	// Private functions
	function createInstance(state, databaseTree, connection) {
        var object = new GoogleChartsBase(state, databaseTree, connection);
        return object;
    }
	
	// Protected functions
	function onLoad(callback){
		
		var onLoadFinish = function(timeVar){
								updateFilters();
						   		callback(currentColumns, timeVar);
						   };
		
		if(currentColumns.length == 0){
			
			var checked = ref.databaseTree.getCheckedColumns() ;
		
			if(checked.length != 0){
					
				currentTable = ref.databaseTree.getTable(checked[0]);
				
				for(index in checked){
					currentColumns.push(checked[index]);
				}	
	
				var bindCategories = function(data){
	
					categories = data ;
					
					for(index in currentColumns){
						
						var info  = jQuery.map(data, function(obj){
										if(obj.column === currentColumns[index].original.name){ return obj ; } 
									})[0];
						
						currentColumns[index].categories = info ;
					}
					
					findTimeVariable(onLoadFinish);
				};
				
				ref.connection.mapChartVariables(currentTable.id, "*", bindCategories) ;
			}
		}
		else {
			
			onLoadFinish(currentColumns, currentTimeVariable);
		}
	}
	
	
	 
	function onNodeChecked(node, callback){
		
		var table = ref.databaseTree.getTable(node) ;
		
		if(table != currentTable){
			
			currentTable = table ;
			currentTimeVariable = undefined ;
			currentColumns = [] ;
			categories = [];
			filters = [] ;
		}
		
		if(categories.length == 0){
			onLoad(callback);
		}
		else {
			
			var info, column, index ;
			
			column = ref.databaseTree.getColumn(node);

			index = jQuery.map(currentColumns, function(obj){
						if(obj.id === column.id){ return currentColumns.indexOf(obj) ; } 
			})[0] ;
			
			if(index != undefined){			
				info = currentColumns[index].categories ;
				currentColumns.splice(index, 1);
			}
			else {
				info = jQuery.map(categories, function(obj){
						if(obj.column === column.original.name){ return obj ; } 
				})[0];
			}
			
			column.categories = info ;
			currentColumns.push(column);
			
			updateFilters(column);
			callback(column);		
		}
	}
	
	function onNodeUnchecked(node, callback){
		
		var index ;
		
		if(node.type == "attr"){
			index = currentColumns.indexOf(node);
			currentColumns.splice(index,1);
			
			node.levels = [] ;
		}
		else {
			node = ref.databaseTree.getColumn(node) ;
		}
		
		updateFilters(node);
		callback(node);
	}
	
	function onDestroy(){
		
		if(this.state.current.data.type != "googlevis"){
			
			
			currentTable = undefined ;
			currentColumns = [] ;
			categories = [] ;
			filters = [];

			if(currentTimeVariable != undefined){
				this.databaseTree.enableCheckbox(currentTimeVariable.id, false);
			}
			
			currentTimeVariable = undefined ;
		}
	}
	
	function updateFilters(node){
		
		var index, column, child, id ;
		
		if(filters.length == 0){
			
			keys = jQuery.map(categories, function(obj){
				if(obj.KEY === true){ return obj.column ; } 
			});
			
			for(index in keys){
			
				id = currentTable.id + "." + keys[index] ;
				
				if(id != currentTimeVariable.id){
					
					column = ref.databaseTree.getTreeNode(id) ;
					column = ref.databaseTree.getColumn(column) ;
																 
					child = column.levels[column.levels.length - 1] ;
									
					if(child == undefined){
						child = DEFAULT.NO_VALUE ;
					}
					
					filters.push({
						column : column,
						value : child 
					});
				}	
			}
		}
		else if(node != undefined && node.categories.GROUP === true) {
				
			index = jQuery.map(filters, function(obj){
				if(obj.column.id == node.id) return filters.indexOf(obj);
			});
				
			filters[index].column = node ;
			
			if(node.levels.length != 0){
				filters[index].value = node.levels[node.levels.length - 1] ;
			}
			else {
				filters[index].value = DEFAULT.NO_VALUE ;
			}
		}

	}
	
	function controlFilters(activeFilters){
		
		var pIndex, cIndex, active, child ;
		
		for(pIndex in filters){
			filter = filters[pIndex];
			
			var active = jQuery.map(activeFilters, function(obj){
				if(obj.column.id === filter.column.id) return obj ;
			})[0];
			
			
			if(active != undefined && active.value.id != null){
				
				for(cIndex in active.column.levels){
					child = active.column.levels[cIndex];
					
					if(child.id != active.value.id){
						ref.databaseTree.disableCheckbox(child.id, false);
					}
					else {
						ref.databaseTree.enableCheckbox(child.id, false);
					}
				}
			}
			else {
				
				for(cIndex in filter.column.levels){
					child = filter.column.levels[cIndex];
					
					if(child.id != null){
						ref.databaseTree.enableCheckbox(child.id, false);
					}					
				}
			}
		}
	}
	
	function findTimeVariable(callback){

		if(currentTable != undefined){
			
			var timeVar = jQuery.map(categories, function(obj){
							if(obj.TIME === true){ return obj.column ; } 
						});	
				
			var id = currentTable.id + "." + timeVar ;
			ref.databaseTree.disableCheckbox(id, true) ;
				
			currentTimeVariable = ref.databaseTree.getOriginalNode(id) ;
			callback(currentTimeVariable);
		}
	}
	
	
	// GoogleChartsBase public API
	GoogleChartsBase.prototype.DEFAULT = DEFAULT ;
	GoogleChartsBase.prototype.LABEL = LABEL ;
	GoogleChartsBase.prototype.PLACEHOLDER = PLACEHOLDER ;
	GoogleChartsBase.prototype.properties = properties ;
	
	GoogleChartsBase.prototype.onLoad = function(callback){
		onLoad.call(this,callback);
	};
	
	GoogleChartsBase.prototype.onNodeChecked = function(node, callback){ 
		onNodeChecked.call(this,node,callback); 
	};
	
	GoogleChartsBase.prototype.onNodeUnchecked = function(node, callback){ 
		onNodeUnchecked.call(this,node,callback); 
	};
	
	GoogleChartsBase.prototype.onDestroy = function(){
		onDestroy.call(this);
	};
	
	GoogleChartsBase.prototype.findTimeVariable = function(callback){
		findTimeVariable.call(this,callback); 
	};
	
	GoogleChartsBase.prototype.controlFilters = function(activeFilters){
		controlFilters.call(this,activeFilters); 
	};
	
	
	return {
        getInstance: function (state, databaseTree, connection) {
            if (!instance) {
                instance = createInstance(state, databaseTree, connection);
            }
            return instance;
        }
    };
}());


	
	
	

