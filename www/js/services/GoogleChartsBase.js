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
						   		callback(currentColumns, timeVar);
						   };
		
		if(currentColumns.length == 0){
			
			var checked = ref.databaseTree.getCheckedColumns() ;
			//controlLevels(checked) ;
		
			if(checked.length != 0){
					
				currentTable = ref.databaseTree.getTable(checked[0]);	
				
				for(index in checked){
					currentColumns.push(checked[index].original);
				}	
	
				var bindCategories = function(data){
	
					categories = data ;
					
					for(index in currentColumns){
						
						var info  = jQuery.map(data, function(obj){
										if(obj.column === currentColumns[index].name){ return obj ; } 
									});
						
						currentColumns[index].categories = info[0];
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
		}
		
		if(categories.length == 0){
			onLoad(callback);
		}
		else {
			
			node = ref.databaseTree.getColumn(node) ;
			
			/* gambiarra - ver como funciona o polimorfismo */
			// var nodes = [] ;
			// nodes.push(node) ;
			// controlLevels(nodes) ;

			var isRepeated = jQuery.map(currentColumns, function(obj){
								if(obj.id === node.id){ return true ; } 
							 })[0] ;
							 
			if(!isRepeated){
				
				var info = jQuery.map(categories, function(obj){
							if(obj.column === node.name){ return obj ; } 
						});
			
				node.categories = info[0] ;
				currentColumns.push(node);
				callback(node);
			} 
		}
	};
	
	function onDestroy(){
		
		if(this.state.current.data.type != "googlevis"){
			
			currentTable = undefined ;
			currentColumns = [] ;
			categories = [] ;

			if(currentTimeVariable != undefined){
				this.databaseTree.enableCheckbox(currentTimeVariable.id);
			}
			
			currentTimeVariable = undefined ;
		}
	}
	
	
	function findTimeVariable(callback){

		if(currentTable != undefined){
			
			var timeVar = jQuery.map(categories, function(obj){
							if(obj.TIME === true){ return obj.column ; } 
						});	
				
			var id = currentTable.id + "." + timeVar ;
			ref.databaseTree.disableCheckbox(id) ;
				
			currentTimeVariable = ref.databaseTree.getOriginalNode(id) ;
			callback(currentTimeVariable);
		}
	}
	
	function controlLevels(nodes){
		
		var index ;
		
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
	
	GoogleChartsBase.prototype.onDestroy = function(){
		onDestroy.call(this);
	};
	
	GoogleChartsBase.prototype.findTimeVariable = function(callback){
		findTimeVariable.call(this,callback); 
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


	
	
	

