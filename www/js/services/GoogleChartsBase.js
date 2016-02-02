services.service("googlecharts", ["databasetree", "connection", function(databaseTree, connection){
	return GoogleChartsBase.getInstance(databaseTree, connection);
}]);


var GoogleChartsBase = (function() {
	
	var instance ;
	
	// Default Values
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
	
	// Labels 
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

	// Placeholders 
	var PLACEHOLDER = {
		get MULTIPLE_DATES(){
			return "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas" ;
		}
	};

	function createInstance(databaseTree, connection) {
        var object = new GoogleChartsBase(databaseTree, connection);
        return object;
    }
	
	function GoogleChartsBase(databaseTree, connection) {

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
	}
	
	GoogleChartsBase.prototype.DEFAULT = DEFAULT ;
	GoogleChartsBase.prototype.LABEL = LABEL ;
	GoogleChartsBase.prototype.PLACEHOLDER = PLACEHOLDER ;
	
	return {
        getInstance: function (databaseTree, connection) {
            if (!instance) {
                instance = createInstance(databaseTree, connection);
            }
            return instance;
        }
    };
}());


	
	
	

