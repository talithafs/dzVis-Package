application.controller("GoogleComboChartController", ["$scope", "$state", "connection", "googlecharts", function($scope, $state, connection, base){
	
	var features = new ComboChartFeatures() ;
	
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

	// New features
	$scope.lineVarLabel = features.LABEL.LINE ;
	$scope.operationLabel = features.LABEL.OPERATIONS ;
	
	$scope.lineOptions = features.DEFAULT.LINE ;
	$scope.operations = features.DEFAULT.OPERATIONS ;
	$scope.lineSelection = $scope.lineOptions[0];
	$scope.operationSelection = $scope.operations[0].value ;

	
	$scope.$on("$stateChangeSuccess", function(){
		
		base.onLoad(fillOptions);
	});
	
	$scope.$on("nodeChecked", function(e, node){
		
		var callback = function(){
		
			if($scope.timeVar.text == base.DEFAULT.TIME.text){
				findTimeVariable(addOption, node);
			}
			else {
				addOption(node);
			}
		};
		
		base.onNodeChecked(node, callback) ;
	});
	
	$scope.$on("nodeUnchecked", function(e, node){
		
		
	});
	
	$scope.$on("$destroy", function(){
        base.onDestroy();
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
	
	
	function findTimeVariable(callback, param){
		
		// if(base.properties.timeVariable == undefined){	
// 
			// base.findTimeVariable(function(timeVar){
// 				
				// $scope.$apply(function(){
					// $scope.timeVar = timeVar ;
					// callback(param) ;
				// });
			// });
		// }
		
		if($scope.timeVar.text == base.DEFAULT.TIME.text) {
			
			$scope.$apply(function(){
					$scope.timeVar = base.properties.timeVariable ;
					callback(param);
			});
		}
	}
	
	function addOption(node){
		
	
	}
	
	function fillOptions(){
		
	}
	
	// $scope.filters = [
		// {column : "Abrangência", value : "Total das áreas"},
		// {column : "Grupo de Idade", value : "20 a 30 anos"}
	// ];
// 	
	// $scope.minDate = "2010-01-01" ;
	// $scope.maxDate = "2011-01-01" ;
}]);


function ComboChartFeatures(){
	
	// New features defaults
	this.DEFAULT = {
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
	this.LABEL = {
		get LINE() {
			return "Desenhar linha com" ;
		},
		get OPERATIONS(){
			return "Operador" ;
		}
	};
}
