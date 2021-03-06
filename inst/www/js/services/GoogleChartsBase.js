/**
 * @fileOverview Definition of the GoogleChartsBase service. It executes tasks that are shared between Google Charts controllers, providing a shared cache for these objects, as well.
 * @author Talitha Speranza
 * @version 0.1
 */

services.service("googlecharts", ["$state", "databasetree", "connection", function(state, databaseTree, connection){
	return GoogleChartsBase.getInstance(state, databaseTree, connection);
}]);

/** @class
 * 	@name GoogleChartsBase 
 *  @classdesc An object that abstracts shared logic between Google Charts controllers
 */
var GoogleChartsBase = (function() {
	
	/**
 	* Callback definition for the onLoad method
 	* @callback onLoadCallback
 	* @param {Array.<DatabaseTree~Node>} columns Columns to be loaded into the fields of the chart form
 	*/
 	
 	/**
 	* Callback definition for the onNodeChecked method
 	* @callback onNodeCheckedCallback
 	* @param {DatabaseTree~Node} node Column to be loaded into the fields of the chart form
 	*/
 	
 	/**
 	* Callback definition for the onNodeUnchecked method
 	* @callback onNodeUncheckedCallback
 	* @param {DatabaseTree~Node} node Column to be unloaded from the fields of the chart form
 	*/
	
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
			return {id : "no_target", text : "Nenhuma"} ;
		},
		get GROUP() {
			return {id : "no_group", text : "Não agrupar"};
		},
		get TIME() {
			return {id : "no_time", text : "Nenhuma"} ;
		},
		get NO_VALUE(){
			return {id: "no_value", text: "Nenhum valor selecionado"} ;
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
			return { 
				 	 DAILY: "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas", 
					 MONTHLY: "Inserir datas no formato mm-aaaa, separadas por vírgulas",
					 YEARLY: "Inserir datas no formato aaaa, separadas por vírgulas"
				   } ;
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
	
	/**
	 * @method GoogleChartsBase#onLoad
	 * @description Function to be called when the event "$stateChangeSuccess" is captured. Loads checked columns into the cache. The array containing these columns will then be passed to the callback as argument.
	 * @param {onLoadCallback} callback The callback that handles the response
	 */
	function onLoad(callback){
		
		var onLoadFinish = function(){
								ref.databaseTree.stopWaiting();
								updateFilters();
						   		callback(currentColumns);
						   };
		
		if(currentColumns.length == 0){
						
			var checked = ref.databaseTree.getCheckedColumns() ;
		
			if(checked.length != 0){
				
				ref.databaseTree.startWaiting();
				currentTable = ref.databaseTree.getTable(checked[0]);
				currentTable = currentTable.original ;
				
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
			onLoadFinish(currentColumns);
		}
	}

	/**
	 * @method GoogleChartsBase#onNodeChecked
	 * @description Function to be called when the event "nodeChecked" is captured. Loads the last checked node into the cache. The node will then be passed to the callback as an argument.
	 * @param {DatabaseTree~Node} node The node that has just been checked
	 * @param {onNodeCheckedCallback} callback The callback that handles the response
	 */
	function onNodeChecked(node, callback){
		
		var table = ref.databaseTree.getTable(node) ;
		table = table.original ;
		
		if(currentTable == undefined || table.id != currentTable.id){
						
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
	
	/**
	 * @method GoogleChartsBase#onNodeUnchecked
	 * @description Function to be called when the event "nodeUnchecked" is captured. Unloads the last unchecked node from the cache. The node will then be passed to the callback as an argument.
	 * @param {DatabaseTree~Node} node The node that has just been unchecked
	 * @param {onNodeUncheckedCallback} callback The callback that handles the response
	 */
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
	
	/**
	 * @method GoogleChartsBase#onDestroy
	 * @description Function to be called when the event "$destroy" is captured. If the currently selected chart is not from the googlevis package, it destroys the cache.
	 */
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
	
	/**
	 * @private
	 * @method GoogleChartsBase#updateFilters
	 * @description If the column represented by the argument 'node' is a key and is not yet cached, stores it. Decides whether the selection of a node demands the usage of a new set of filters. The results are stored in the cache.
	 * @param {DatabaseTree~Node} node The selected node
	 */
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
	
	/**
	 * @method GoogleChartsBase#controlFilters
	 * @description Controls the state of the tree according to the active filters, that is, the currently selected filters. 
	 * @param {Array.<DatabaseTree~Node>} activeFilters Current set of filters
	 */
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
	
	/**
	 * @private
	 * @method GoogleChartsBase#findTimeVariable
	 * @description Finds the time variable of the current table
	 * @param {onLoadCallback} callback The callback that handles the response
	 */
	function findTimeVariable(callback){

		if(currentTable != undefined){
			
			var timeVar = jQuery.map(categories, function(obj){
				if(obj.TIME === true){ return obj ; } 
			})[0];	
				
			var id = currentTable.id + "." + timeVar.column ;
			ref.databaseTree.disableCheckbox(id, true) ;
				
			currentTimeVariable = ref.databaseTree.getOriginalNode(id) ;
			currentTimeVariable.maximum = timeVar.MAXIMUM ;
			currentTimeVariable.minimum = timeVar.MINIMUM ;
			
			callback(currentTimeVariable);
		}
	}
	
	/**
	 * @method GoogleChartsBase#checkVariables
	 * @description Checks if there's at least one target variable and exactly one time variable
	 * @param {String} target The name of the column that contains the target variable
	 * @param {String} time The name of the column that contains the time variable
	 * @return {String} An error message or the string "VALID"
	 */
	function checkVariables(target, time){
		
		if(target == undefined || target == "" || target.length == 0){
			return "Nenhuma variável numérica foi selecionada" ;
		}
		else if(time == "" || time == undefined){
			return "Nenhuma variável temporal foi encontrada" ;
		}
		
		return "VALID" ;
	}
	
	function checkFilters(filters){
		
		if(filters == undefined){
			return "Interno. A variável 'filters' não foi definida." ;
		}
		
		var index ;
		for(index in filters){
			var filter = filters[index] ;
			
			if(filter.value.id == DEFAULT.NO_VALUE.id){
				return "É necessário selecionar algum valor para o filtro " + filter.column.text.toUpperCase() ;
			}
		}
		
		return "VALID" ;
	}
	
	// GoogleChartsBase.prototype.getTargetVar = function(target){
		// return getTargetVar.call(this,target); 
	// };
	
	function getTargetVar(target){
		
		if(target == undefined || target[0].id == DEFAULT.TARGET.id ){
			return "" ;
		}
	
		var index ;
		var names = [];
		
		for(index in target){
			names.push(target[index].original.name);
		}
		
		if(names.length == 1){
			return names[0];
		}
		
		return names ;
		
	}
	
	// GoogleChartsBase.prototype.getGroupVar = function(group){
		// return getGroupVar.call(this,group); 
	// };
	
	function getGroupVar(group){
		
		if(group == undefined || group.id == DEFAULT.GROUP.id){
			return "" ;
		}
		
		return group.original.name  ;
	}
	
	// GoogleChartsBase.prototype.getTimeVar = function(timeVar){
		// return getTimeVar.call(this,timeVar); 
	// };
	
	function getTimeVar(timeVar){
		
		if(timeVar == undefined || timeVar.text == DEFAULT.TIME.text){
			return "" ;
		}
		
		return timeVar.name ;
	}
	
	// GoogleChartsBase.prototype.getRestrictions = function(filters){
		// return getRestrictions.call(this,filters); 
	// };
	
	function getRestrictions(filters){
		
		var index ;
		var restrictions = [] ;
		
		for(index in filters){
			var filter = filters[index];
			
			restrictions.push([filter.column.original.name, filter.value.text]);
		}
		
		return restrictions ;
	}
	
	// GoogleChartsBase.prototype.getAlternatives = function(group){
		// return getAlternatives.call(this,group); 
	// };
	
	function getAlternatives(group){
		
		var index, name ;
		var alternatives = [] ;
		
		if(group == undefined || group.id == DEFAULT.GROUP.id){
			return [] ;
		}
		name = group.original.name ;
		
		for(index in group.levels){
			var level = group.levels[index];
			
			alternatives.push([name, level.text]);
		}
		
		return alternatives ;
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
	
	GoogleChartsBase.prototype.checkFilters = function(filters){
		return checkFilters.call(this,filters); 
	};
	
	GoogleChartsBase.prototype.checkVariables = function(target, time){
		return checkVariables.call(this,target, time); 
	};
	
	GoogleChartsBase.prototype.getTargetVar = function(target){
		return getTargetVar.call(this,target); 
	};
	
	GoogleChartsBase.prototype.getGroupVar = function(group){
		return getGroupVar.call(this,group); 
	};
	
	GoogleChartsBase.prototype.getTimeVar = function(timeVar){
		return getTimeVar.call(this,timeVar); 
	};
	
	GoogleChartsBase.prototype.getRestrictions = function(filters){
		return getRestrictions.call(this,filters); 
	};
	
	GoogleChartsBase.prototype.getAlternatives = function(group){
		return getAlternatives.call(this,group); 
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


	
	
	

