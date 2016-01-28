application.controller("ChartsController",["$scope", "$state", "connection", function($scope, $state, connection){
	
	$scope.chartListVisible = true ;
	$scope.selectChartText = "Escolha um tipo de gráfico";
	$scope.useChartText = "Usar este gráfico >>";
	$scope.goBackText = "<< Escolher outro gráfico" ;
	
	$.getJSON("data/charts.json", function(data) {
			
		$scope.options = data ;
		$scope.selection = $scope.options[0] ;
	});
	
	$scope.chartSelectionChanged = function(value){
		
		$scope.selection = value ;
	};
	
	$scope.selectChart = function(){
		
		$scope.chartListVisible = false ;
		$state.go($scope.selection.name) ;
	};
	
	$scope.goBack = function(){
		
		$scope.chartListVisible = true ;
	};
	
}]);
