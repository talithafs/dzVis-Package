application.controller("ChartsController",["$scope", "$state", "charts", "connection", function($scope, $state, charts, connection){
	
	charts.success(function(data){
		$scope.options = data ;
		$scope.selection = $scope.options[0] ;
	});
	
	$scope.chartListVisible = true ;
	$scope.selectChartText = "Escolha um tipo de gráfico";
	$scope.useChartText = "Usar este gráfico >>";
	$scope.goBackText = "<< Escolher outro gráfico" ;
	$scope.btnCreateChartText = "Gerar gráfico" ;
	
	
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
	
	$scope.createChart = function(){
		$scope.$broadcast("createChart", $state.current.name);
	};
	
	$scope.checkDates = function(dates, format, lowerBound, upperBound){
		
		var regex, match = "" ;
		var results = [] ;
		
		if(format == 'yyyy-mm-dd'){
			
			regex = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/ ;
		}
		else if(format == 'dd-mm-yyyy'){
			
			regex = /^(\d{1,2})\-(\d{1,2})\-(\d{4})$/ ;
		}
		else {
			return false ;
		}
		
		for(index in dates){
				
			match = dates[index].match(regex);
			
			if(match != null){
				
				if(format == 'dd-mm-yyyy'){
					var temp = match[1] ;
					match[1] = match[3];
					match[3] = temp ; 
				}
				
				date = match[1] + "-" + match[2] + "-" + match[3] ;
					
				if(match[3] < 1 || match[3] > 31){
					return "Erro: Data inválida. Dia inválido: " + date ;
				}
				
				if(match[2] < 1 || match[2] > 12){
					return "Erro: Data inválida. Mês inválido: " + date ;
				}
				
				if(date <= lowerBound || date >= upperBound){
					return "Erro: Data inválida. Data não está dentro dos limites: " + date;
				}
				
				results.push(date);
			}
			else {
				return "Erro: Data inválida. Formato inválido: " + dates[index] ;
			}
		}
		
		return results ;
	};
	
}]);
