application.controller("GoogleComboChartController", [ "$scope", function($scope){
	
	$scope.targetVarLabel = "Variáveis numéricas" ;
	$scope.groupVarLabel = "Agrupar por" ;
	$scope.timeVarLabel = "Variável temporal";
	$scope.lineVarLabel = "Desenhar linha com" ;
	$scope.minLabel = "Início:" ;
	$scope.maxLabel = "Fim:  " ;
	$scope.selectMultipleDatesLabel = "Selecionar múltiplas datas >>" ;
	
	$scope.targetOptions = ["Percentual Ativas", "Ativas por mil", "Percentual total"];
	$scope.groupOptions = ["Percentual Ativas", "Ativas por mil", "Percentual total"];
	$scope.timeOptions = ["Percentual Ativas", "Ativas por mil", "Percentual total"] ;
	
	$scope.selectMultipleDates = function(){ };
}]);