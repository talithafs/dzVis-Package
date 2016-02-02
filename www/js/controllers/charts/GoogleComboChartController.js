application.controller("GoogleComboChartController", [ "$scope", "connection", "googlecharts", function($scope, connection, base){
	
	// Google Charts labels
	$scope.targetVarLabel =  base.LABEL.TARGET;
	$scope.groupVarLabel = base.LABEL.GROUP ;
	$scope.timeVarLabel = base.LABEL.TIME ;
	$scope.filtersLabel = base.LABEL.FILTERS ;
	$scope.minLabel = base.LABEL.MIN_DATE ;
	$scope.maxLabel = base.LABEL.MAX_DATE ;
	$scope.placeholder = base.PLACEHOLDER.MULTIPLE_DATES ;
	$scope.selectMultipleDatesLabel = base.LABEL.MULTIPLE_DATES ;
	
	// Google Charts default values
	$scope.targetOptions = base.DEFAULT.TARGET ;
	$scope.groupOptions = base.DEFAULT.GROUP ;
	$scope.timeVar = base.DEFAULT.TIME ;
	
	$scope.targetSelection = $scope.targetOptions[0] ;
	$scope.groupSelection = $scope.groupOptions[0] ;
	
	// New features defaults
	var DEFAULT = {
		get LINE(){
			return [{id : null, text : "Não desenhar linha"}] ;
		},
		get OPERATIONS(){
			return [
				{name: "Nenhuma", value: "none"},
				{name: "Desvio Padrão", value: "std"},
				{name: "Média", value: "mean"}
			];
		}
	};
	
	// New features labels
	var LABEL = {
		get LINE() {
			return "Desenhar linha com" ;
		},
		get OPERATIONS(){
			return "Operador" ;
		}
	};
	
	$scope.lineVarLabel = LABEL.LINE ;
	$scope.operationLabel = LABEL.OPERATIONS ;
	
	$scope.lineOptions = DEFAULT.LINE ;
	$scope.operations = DEFAULT.OPERATIONS ;
	$scope.lineSelection = $scope.lineOptions[0];
	$scope.operationSelection = $scope.operations[0].value ;

	
	$scope.$on("treeClicked", function(e, instance){
		
		base.onTreeClicked(e, instance) ;
	});
	
	$scope.selectMultipleDates = function(){
		
		$scope.multipleDatesMode = !$scope.multipleDatesMode ;
		
		if($scope.multipleDatesMode){
			$scope.selectMultipleDatesLabel = base.LABEL.INTERVAL ;
		}
		else {
			$scope.selectMultipleDatesLabel = base.LABEL.MULTIPLE_DATES ;
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