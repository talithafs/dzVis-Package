application.controller("ChartsController",["$scope", "$state", "charts", "connection", function($scope, $state, charts, connection){
	
	charts.success(function(data){
		$scope.options = data ;
		$scope.selection = $scope.options[0] ;
	});
	
	$scope.chartListVisible = true ;
	$scope.selectChartText = "Escolha um tipo de gráfico";
	$scope.useChartText = "Usar este gráfico >>";
	$scope.goBackText = "<< Escolher outro gráfico" ;
	
	
	$scope.chartSelectionChanged = function(value){
		
		$scope.selection = value ;
	};
	
	$scope.selectChart = function(){
		
		$scope.chartListVisible = false ;
		$scope.chartName = $scope.selection.name ;
		$state.go($scope.selection.name) ;
	};
	
	$scope.goBack = function(){
		
		$scope.chartListVisible = true ;
	};
	
}]);
