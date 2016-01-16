application.controller("DetailsController",["$scope", "databasetree", "connection", function($scope, databaseTree, connection){
	
	const DEF_NVALUES = 20 ;
	const STR_VIEW_DATA = "Ver Dados >>" ;
	const STR_BACK = "<< Voltar" ;
	const STR_EMPTY = "" ;
	const DEF_TEXT = "Clique em uma tabela ou em alguma de suas colunas para obter detalhes de sua especificação." ;
	
	var currentAttr = undefined ;
	var currentTable = undefined ;
	
	$scope.showDefault = true ;
	$scope.showData = false ;
	$scope.loading = false ;
	$scope.defaultText = DEF_TEXT ;
	$scope.viewData = STR_VIEW_DATA ;
	$scope.nValues = DEF_NVALUES ;
	
	
	$scope.$on("treeClicked", function(e, instance){

		var checked = instance.get_checked(true);
		var dim = checked.length ;
		
		if(dim != 0){
			currentAttr = databaseTree.getCurrentAttr(checked);
			currentTable = databaseTree.getCurrentTable(currentAttr);

			$scope.table = currentTable.text ;
			$scope.column = currentAttr.text ;
			$scope.tableDescription = currentTable.description ;
			$scope.columnDescription = currentAttr.description ;
			$scope.showDefault = false ;
        }
		else {
			$scope.showDefault = true ;
			$scope.showData = false ;
		}
	});
	
	$scope.viewDataClicked = function(){
		
		$scope.showData = !$scope.showData ;
		
		if($scope.showData){
			
			$scope.loading = true ;
			
			var callback = function(results){
					
				$scope.$apply(function() {
					
					$scope.viewData = STR_BACK ;
					$scope.sampleData = results ;
					$scope.loading = false ;
				});
			};
		
			connection.getAttributeValues(currentAttr.id, currentTable.id, $scope.nValues, callback) ;
		}
		else {
			$scope.viewData = STR_VIEW_DATA ;
			$scope.sampleData = STR_EMPTY ;
			$scope.nValues = DEF_NVALUES ;
		}
	};
	
	$scope.selectionChanged = function(value) {
		
		var callback = function(results){
			
			$scope.$apply(function() {
				$scope.loading = false ;
				$scope.sampleData = results ;
			});
		};
		
		if($scope.nValues != value){
			
			$scope.nValues = value ;
			$scope.loading = true ;
			$scope.sampleData = STR_EMPTY ;
			
			connection.getAttributeValues(currentAttr.id, currentTable.id, $scope.nValues, callback) ;
		}
	};
	
}]);


