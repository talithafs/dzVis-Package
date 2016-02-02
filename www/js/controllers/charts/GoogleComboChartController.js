application.controller("GoogleComboChartController", [ "$scope", "connection", "googlecharts", function($scope, connection, gCharts){
	
	// // Google Charts labels
	// $scope.targetVarLabel = gCharts.LBL_TARGET ;
	// $scope.groupVarLabel = gCharts.LBL_GROUP ;
	// $scope.timeVarLabel = gCharts.LBL_TIME ;
	// $scope.filtersLabel = gCharts.LBL_FILTERS ;
	// $scope.minLabel = gCharts.LBL_MIN_DATE ;
	// $scope.maxLabel = gCharts.LBL_MAX_DATE ;
	// $scope.placeholder = gCharts.PLH_MULTIPLE_DATES ;
	// $scope.selectMultipleDatesLabel = gCharts.LBL_MULTIPLE_DATES ;
// 	
	// // Google Charts default values
	// $scope.targetOptions = gCharts.DEFAULT_TARGET ;
	// $scope.groupOptions = gCharts.DEFAULT_GROUP ;
	// $scope.timeVar = gCharts.DEFAULT_TIME ;
// 	
	// $scope.targetSelection = gCharts.DEFAULT_TARGET[0] ;
	// $scope.groupSelection = gCharts.DEFAULT_GROUP[0];
// 	
	// // New features labels
	// $scope.lineVarLabel = "Desenhar linha com" ;
	// $scope.operationLabel = "Operador" ;
// 	
	// // New features defaults
	// var DEFAULT_LINE = [{id : null, text : "Não desenhar linha"}] ;
// 	
	// var DEFAULT_OPERATIONS = [
		// {name: "Nenhuma", value: "none"},
		// {name: "Desvio Padrão", value: "std"},
		// {name: "Média", value: "mean"}
	// ];
// 	
	// $scope.lineOptions = DEFAULT_LINE ;
	// $scope.operations = DEFAULT_OPERATIONS ;
	// $scope.lineSelection = DEFAULT_LINE[0];
	// $scope.operationSelection = DEFAULT_OPERATIONS[0].value ;

	
	$scope.$on("treeClicked", function(e, instance){
		
		//gCharts.onTreeClicked(e, instance) ;
		
		// testes
		// alert(gCharts.test("ola"));
		// gCharts.setSomething = "trolha" ;
// 		
		// alert(gCharts.test("ooooi"));
// 		
		// alert(gCharts.other("siiiim"));
		
		alert(gCharts.constants.bla + " " + gCharts.constants.fu);
		
		gCharts.constants.bla = "fuck" ;
		
		alert(gCharts.constants.bla);
		
		gCharts.constants = "dirty" ;
		
		alert(gCharts.getConst().bla);
		
		
	});
	
	$scope.selectMultipleDates = function(){
		
		$scope.multipleDatesMode = !$scope.multipleDatesMode ;
		
		if($scope.multipleDatesMode){
			$scope.selectMultipleDatesLabel = gCharts.LBL_INTERVAL ;
		}
		else {
			$scope.selectMultipleDatesLabel = gCharts.LBL_MULTIPLE_DATES ;
		}
	};
	
	$scope.operationSelectionChanged = function(value){
		
		$scope.operationSelection = value ;
	};
	
	
	
	// $scope.filters = [
		// {column : "Abrangência", value : "Total das áreas"},
		// {column : "Grupo de Idade", value : "20 a 30 anos"}
	// ];
// 	
	// $scope.minDate = "2010-01-01" ;
	// $scope.maxDate = "2011-01-01" ;
}]);