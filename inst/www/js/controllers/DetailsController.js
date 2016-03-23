/**
 * @fileOverview Definition of the DetailsController. It manages the elements and the events associated with the details panel
 * @author Talitha Speranza
 * @version 0.1
 */

/** @class 
 *	@name DetailsController */
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
	
	
	/** 
	 * @private
	 * @function DetailsController#treeClickedListener
	 * @description Shows the details of the checked column
	 * @listens TreeController#treeClicked */ 
	$scope.$on("treeClicked", function(e, checked){
		var dim = checked.length ;
		
		if(dim != 0){
			currentAttr = databaseTree.getLastColumn();
			currentTable = databaseTree.getLastTable();

			$scope.table = currentTable.text ;
			$scope.column = currentAttr.text ;
			$scope.tableDescription = currentTable.original.description ;
			$scope.columnDescription = currentAttr.original.description ;
			$scope.showDefault = false ;
        }
		else {
			$scope.showDefault = true ;
			$scope.showData = false ;
		}
	});
	
	/** 
	 * @private
	 * @function DetailsController#viewDataClicked
	 * @description Shows column data or the columns description, reacting to the choice of the user
	 */
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
		
			connection.getColumnValues(currentAttr.id, currentTable.id, $scope.nValues, callback) ;
		}
		else {
			$scope.viewData = STR_VIEW_DATA ;
			$scope.sampleData = STR_EMPTY ;
			$scope.nValues = DEF_NVALUES ;
		}
	};
	
	/** 
	 * @private
	 * @function DetailsController#selectionChanged
	 * @description Shows a different quantity of column data, according to the choice of the user.
	 */
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
			
			connection.getColumnValues(currentAttr.id, currentTable.id, $scope.nValues, callback) ;
		}
	};
	
}]);


