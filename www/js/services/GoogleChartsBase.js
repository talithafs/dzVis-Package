services.service("googlecharts", ["databasetree", "connection", function(databaseTree, connection){
	return new GoogleChartsBase(databaseTree, connection);
}]);


//var GoogleChartsBase = (function(databaseTree, connection) {
	
	function GoogleChartsBase(databaseTree, connection) {

		// Default values 
		var DEFAULT_TARGET = [{id : null, text : "Nenhuma"}] ;
		var DEFAULT_GROUP = [{id : null, text : "Não agrupar"}];
		var DEFAULT_TIME = {id : null, text : "Nenhuma"} ;
		
		// Labels
		var LBL_MULTIPLE_DATES = "Selecionar múltiplas datas" ;
		var LBL_INTERVAL = "Selecionar intervalo" ;
		var LBL_TARGET = "Variáveis numéricas" ; 	
		var LBL_GROUP = "Agrupar por" ;
		var LBL_TIME = "Variável temporal";
		var LBL_FILTERS = "Filtros" ;
		var LBL_MIN_DATE = "Início:" ;
		var LBL_MAX_DATE = "Fim:" ;
		
		// Placeholders
		var PLH_MULTIPLE_DATES = "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas" ;
		
		// Variables 
		var currentTable = undefined ;
		var validationMatrix = undefined ;
		var lastCheckedId = "" ;
		
		// Functions
		var onTreeClicked = function(e, instance){
			
			var checked = instance.get_checked(true);
			var dim = checked.length ; 
			
			if(checked[dim-1] != undefined){
				
				var justChecked = checked[dim-1] ;
				var table = databaseTree.getCurrentTable(justChecked) ;
				var column = "" ;
				var colNames = "" ;
				
				if(table != currentTable){
					currentTable = table ;
					validationMatrix = [] ;
					lastCheckedId = "" ;
				}
				
				if(justChecked.type == "lvl"){
					column = instance.get_parent(justChecked);
				}
				else {
					column = justChecked.id ;
				}
				
				var colNames = validationMatrix.map(function(value,index) { 
					return value[0] ; 
				});
				
				if(justChecked.id != lastCheckedId && colNames.indexOf(column) == -1 ){
					validationMatrix.push([column, 'heey']);
					alert(validationMatrix);
				}
				
				lastCheckedId = justChecked.id ;
			}	
			
		};
		
		
		// Tests 
		var something = null ;
		 		
		var setSomething = function(value){
			something = value ;
			return something ;
		};
		
		GoogleChartsBase.prototype.test = function(value){
			return setSomething.call(this, value);
		};
		
		var other = null ;
		
		var setOther = function(value){
			other = value ;
			return other ;
		};
		
		GoogleChartsBase.prototype.other = function(value){
			return setOther.call(this, value);
		};
		
		var constants = {
			get bla() {
				return "blabla";
			},
			get fu(){
				return "fufu" ;
			}
		};
		
		GoogleChartsBase.prototype.constants = constants ;
		
		GoogleChartsBase.prototype.getConst = function(){
			return constants ;
		};
		
		//Public API
		// return {
			// DEFAULT_TARGET : DEFAULT_TARGET,
			// DEFAULT_GROUP : DEFAULT_GROUP,
			// DEFAULT_TIME : DEFAULT_TIME,
			// LBL_MULTIPLE_DATES : LBL_MULTIPLE_DATES,
			// LBL_INTERVAL : LBL_INTERVAL,
			// LBL_TARGET : LBL_TARGET,
			// LBL_GROUP : LBL_GROUP,
			// LBL_TIME : LBL_TIME,
			// LBL_FILTERS : LBL_FILTERS,
			// LBL_MIN_DATE : LBL_MIN_DATE,
			// LBL_MAX_DATE : LBL_MAX_DATE,
			// PLH_MULTIPLE_DATES : PLH_MULTIPLE_DATES,
			// onTreeClicked : onTreeClicked,
		// };
	}
	
	// function doSomething(value){
		// return this.setSomething(value);
	// }

	
	//return GoogleChartsBase ;
	
//}());


	
	
	

// function GoogleChartsBase(databaseTree, connection) {
// 	
	// // Default values 
	// var DEFAULT_TARGET = [{id : null, text : "Nenhuma"}] ;
	// var DEFAULT_GROUP = [{id : null, text : "Não agrupar"}];
	// var DEFAULT_TIME = {id : null, text : "Nenhuma"} ;
// 	
	// // Labels
	// var LBL_MULTIPLE_DATES = "Selecionar múltiplas datas" ;
	// var LBL_INTERVAL = "Selecionar intervalo" ;
	// var LBL_TARGET = "Variáveis numéricas" ; 	
	// var LBL_GROUP = "Agrupar por" ;
	// var LBL_TIME = "Variável temporal";
	// var LBL_FILTERS = "Filtros" ;
	// var LBL_MIN_DATE = "Início:" ;
	// var LBL_MAX_DATE = "Fim:" ;
// 	
	// // Placeholders
	// var PLH_MULTIPLE_DATES = "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas" ;
// 	
	// // Variables 
	// var currentTable = undefined ;
	// var validationMatrix = undefined ;
	// var lastCheckedId = "" ;
// 	
	// // Functions
	// var onTreeClicked = function(e, instance){
// 		
		// var checked = instance.get_checked(true);
		// var dim = checked.length ; 
// 		
		// if(checked[dim-1] != undefined){
// 			
			// var justChecked = checked[dim-1] ;
			// var table = databaseTree.getCurrentTable(justChecked) ;
			// var column = "" ;
			// var colNames = "" ;
// 			
			// if(table != currentTable){
				// currentTable = table ;
				// validationMatrix = [] ;
				// lastCheckedId = "" ;
			// }
// 			
			// if(justChecked.type == "lvl"){
				// column = instance.get_parent(justChecked);
			// }
			// else {
				// column = justChecked.id ;
			// }
// 			
			// var colNames = validationMatrix.map(function(value,index) { 
				// return value[0] ; 
			// });
// 			
			// if(justChecked.id != lastCheckedId && colNames.indexOf(column) == -1 ){
				// // validationMatrix.push([column, 'heey']);
				// // alert(validationMatrix);
			// }
// 			
			// lastCheckedId = justChecked.id ;
		// }	
// 		
	// };
// 	
	// // Public API
	// return {
		// DEFAULT_TARGET : DEFAULT_TARGET,
		// DEFAULT_GROUP : DEFAULT_GROUP,
		// DEFAULT_TIME : DEFAULT_TIME,
		// LBL_MULTIPLE_DATES : LBL_MULTIPLE_DATES,
		// LBL_INTERVAL : LBL_INTERVAL,
		// LBL_TARGET : LBL_TARGET,
		// LBL_GROUP : LBL_GROUP,
		// LBL_TIME : LBL_TIME,
		// LBL_FILTERS : LBL_FILTERS,
		// LBL_MIN_DATE : LBL_MIN_DATE,
		// LBL_MAX_DATE : LBL_MAX_DATE,
		// PLH_MULTIPLE_DATES : PLH_MULTIPLE_DATES,
		// onTreeClicked : onTreeClicked
	// };
// }


