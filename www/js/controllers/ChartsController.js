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
	$scope.information = "Utilize esse código para mostrar o gráfico em seu site. Clique no ícone para copiar para a sua área de transferência." ;
	$scope.copyText = "Copiar para a área de transferência" ;
	$scope.showChart = false ;
	$scope.showAlert = false ;
	$scope.errorText = "Erro: ";
	
	const COPIED = "O código foi copiado para a sua área de transferência." ;
	const NOT_COPIED = "Houve um problema e o código não foi copiado para sua área de transferência." ;
	
	
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
	
	$scope.$on("chartCreated", function(e, data){
		
		var chart, height, width ;
		
		height = data.height + 55 ;
		width = data.width + 10 ;
		
		chart = angular.element(document.querySelector('#chart'));
		chart.attr('src',data.chartFilePath);
		chart.attr('height', height);
		chart.attr('width', width) ;
		
		$scope.$apply(function(){
			
			if($scope.showAlert){
				$scope.showAlert = false ;
			}
			
			$scope.showChart = true ;		
			$scope.chartAddress = "<iframe width=\"" + width 
									+ "px\" height=\"" + height  
									+ "px\" frameborder=\"0\" src=\"" + data.chartFilePath + "\"> </iframe>" ;
									
			$scope.chartURL = data.chartFilePath ;
			$scope.sourceURL = data.sourceDataPath ;
		});
	});

	$scope.$on("chartError", function(e, message){
		
		$scope.showAlert = true ;
		$scope.errorMessage = message ;
		
	});
	
	$scope.alertClosed = function(){
		
		$scope.showAlert = false ;
	};
	
	$scope.copyToClipboard = function(){
		
		var textarea = angular.element(document.querySelector('#code'));
		textarea.select();
		
		try {
    		var success = document.execCommand('copy');
    		var message = success ? COPIED : NOT_COPIED ;
    		alert(message);
  		} 
  		catch (error) {
    		console.log(JSON.stringify(error));
  		}
	};
	
	$scope.checkDates = function(dates, format, lowerBound, upperBound){
		
		var regex, match = "" ;
		var results = [] ;
		
		if(!(dates instanceof Array)){
			var temp = dates ;
			dates = [] ;
			dates.push(temp);
		}
		
		if(format == 'yyyy-mm-dd'){
			
			regex = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/ ;
		}
		else if(format == 'dd-mm-yyyy'){
			
			regex = /^(\d{1,2})\-(\d{1,2})\-(\d{4})$/ ;
		}
		else {
			return "Interno. Formato de data especificado não corresponde a um formato válido." ;
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
					return "Data inválida. Dia inválido: " + date ;
				}
				
				if(match[2] < 1 || match[2] > 12){
					return "Data inválida. Mês inválido: " + date ;
				}
				
				if(date < lowerBound || date > upperBound){
					return "Data inválida. Data não está dentro dos limites: " + date;
				}
				
				results.push(date);
			}
			else {
				return "Data inválida. Formato inválido: " + dates[index] ;
			}
		}
		
		return results ;
	};
	
}]);
