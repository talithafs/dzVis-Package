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
	$scope.filters = [] ;
	
	$scope.targetSelection = [] ;
	$scope.targetSelection.push($scope.targetOptions[0]) ;	
	$scope.groupSelection = $scope.groupOptions[0] ;

	// New features
	$scope.lineVarLabel = features.LABEL.LINE ;
	$scope.operationLabel = features.LABEL.OPERATIONS ;
	
	$scope.lineOptions = [] ;
	$scooe.lineOptions.push(features.DEFAULT.LINE[0]);
	$scope.lineSelection = $scope.lineOptions[0];
	
	$scope.operations = features.DEFAULT.OPERATIONS ;	
	$scope.operationSelection = $scope.operations[0].value ;

	$scope.$on("$stateChangeSuccess", function(){
		
		base.onLoad(fillOptions);
	});
	
	$scope.$on("nodeChecked", function(e, node){
		
		base.onNodeChecked(node, addOption) ;
	});
	
	$scope.$on("nodeUnchecked", function(e, node){
		
		base.onNodeUnchecked(node, removeOption);
	});
	
	$scope.$on("$destroy", function(){
		
        base.onDestroy();
    });
    
    $scope.$on("createChart", function(){
    	
    	// var callback = function(parameters, filepath){
//     		
    		// alert(JSON.stringify(parameters));
    		// alert(filepath);
    	// };
//     	    	
    	// connection.createComboChart("chart.html", "", "","", "", "", "", [], [], callback);
    	
    	// a = $scope.multipleDates.split(",") ;
//     	
    	// alert(a[0] + " " + a[1]);
    	
    	// alert($scope.$parent.checkDates($scope.multipleDates.split(","), 'yyyy-mm-dd', $scope.lowerBound, $scope.upperBound));
 		   	
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
    
    $scope.targetSelectionChanged = function(value){
    	
    	$scope.targetSelection = value ;
    	
    	changeTarget();
    };
    
    $scope.groupSelectionChanged = function(value){
    	
    	$scope.groupSelection = value ;
    	
    	changeGroup();	
    };

	$scope.operationSelectionChanged = function(value){
		
		$scope.operationSelection = value ;
		
		if($scope.operationSelection == $scope.operations[0].value){
			$scope.lineSelection = $scope.lineOptions[0] ;
		}
	};
	
	$scope.lineSelectionChanged = function(value){
		
		$scope.lineSelection = value ;
		
		if($scope.lineSelection == $scope.lineSelection[0]){
			$scope.operationSelection = $scope.operations[0].value ;
		}
	};
	
	function fillOptions(nodes, timeVar){

		$scope.$apply(function(){
			$scope.timeVar = timeVar ;
		});
		
		for(index in nodes){
			addOption(nodes[index]);
		}
	}
	
	
	function addOption(node){
		
		if(node instanceof Array){
			node = node[0];
		}
		
		$scope.$apply(function(){
			
			if(node.categories.TARGET === true){
				
				$scope.targetOptions.push(node);				
				//$scope.lineOptions.push(node);
				$scope.targetSelection.push(node);
				//$scope.lineSelection = node ;
				
				changeTarget();
			}
			else if(node.categories.GROUP === true){
				
				var group = jQuery.map($scope.groupOptions, function(obj){
								if(obj.id === node.id){ return obj ; } 
							})[0];
							
				if(group == undefined){
					$scope.groupOptions.push(node);
					$scope.groupSelection = node ;
				}
				else {
					$scope.groupSelection = group ;
				}
				
				changeGroup();
			}
			
			if($scope.timeVar.text == base.DEFAULT.TIME.text){
				$scope.timeVar = base.properties.timeVariable ;
				$scope.minDate = base.properties.timeVariable.minimum ;
				$scope.maxDate = base.properties.timeVariable.maximum ;
				$scope.upperBound = $scope.maxDate ;
				$scope.lowerBound = $scope.minDate ;
			}
		});
	}
	
	function removeOption(node){
		
		var index, dim, group ;
			
		$scope.$apply(function(){
			
			if(node.categories.TARGET === true){

				index = $scope.targetOptions.indexOf(node);
				$scope.targetOptions.splice(index,1);
				
				index = $scope.lineOptions.indexOf(node);
				
				if(index != -1){
					$scope.lineOptions.splice(index,1);
				}
				
				index = $scope.targetSelection.indexOf(node);
				$scope.targetSelection.splice(index,1);
				
				if($scope.targetOptions.length == 0){
					$scope.targetOptions = base.DEFAULT.TARGET ;
				}
				
				if($scope.targetSelection.length == 0){
					dim = $scope.targetOptions.length ;
					$scope.targetSelection.push($scope.targetOptions[dim-1]);
				}
				
				// dim = $scope.lineOptions.length ;
				// $scope.lineSelection = $scope.lineOptions[dim-1];
				
				changeTarget();
			}
			else if(node.categories.GROUP === true){
				
				if(node.levels != undefined && node.levels.length != 0){
					updateFilters();
				}
				else {
					
					group = jQuery.map($scope.groupOptions, function(obj){
						if(obj.id == node.id) return obj;
					})[0];
				
					index = $scope.groupOptions.indexOf(group);
				
					if(index != -1){
					
						$scope.groupOptions.splice(index,1);
						dim = $scope.groupOptions.length ;
						
							if(dim != 0){
								$scope.groupSelection = $scope.groupOptions[dim-1] ;
							}
							else {
								$scope.groupSelection = base.DEFAULT.GROUP ;
							}
					}
				
					changeGroup();
				}
			}

		});
	}
	
	
	function changeTarget(){
		
		if($scope.targetSelection.length != 1){
	
			if($scope.targetSelection[0].text === base.DEFAULT.TARGET[0].text){
				$scope.targetSelection.splice(0,1);
				$scope.targetOptions.splice(0,1);
			}
			
			if($scope.groupSelection != $scope.groupSelection[0]){
				$scope.groupSelection = $scope.groupOptions[0] ;
				updateFilters();
			}
		}
		else {			
			var dim = $scope.groupOptions.length ;
			var lastGroup = $scope.groupOptions[dim - 1] ;
			
			$scope.groupSelection = lastGroup ;
			updateFilters();
		}
		
		changeLine();
	}
	
	function changeGroup(){
		
		if($scope.groupSelection != $scope.groupOptions[0]){
			
			var dim = $scope.targetSelection.length ;
					
			if(dim != 1){
				var lastSelection = $scope.targetSelection[dim-1] ;
				$scope.targetSelection = [] ;
				$scope.targetSelection.push(lastSelection) ;
			}
		}
		else {			
			$scope.lineSelection = $scope.lineOptions[0] ;
			$scope.operationSelection = $scope.operations[0];
		}
		
		updateFilters();
		changeLine();
	}
	
	function changeLine(targetChanged){
		
		//if(targetChanged){
			var opt = $scope.lineOptions[1] ;
			
			if($scope.targetSelection[0].text == base.DEFAULT.TARGET.text){
				
				if($scope.lineOptions.length != 1){
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE[0]);
					$scope.lineSelection = $scope.lineOptions[0];
 				}
			}
			else if($scope.targetSelection.length == 1){
				
				if(opt == undefined || (opt != undefined && opt.id == features.DEFAULT.LINE[1].id)){
					
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE[0]);
					
					for(index in $scope.targetOptions){
						$scope.lineOptions.push($scope.targetOptions[index]);
					}
					
					$scope.lineSelection = $scope.targetSelection ;
				}
			}
			else {
				if(opt == undefined || (opt != undefined && opt.id != features.DEFAULT.LINE[1].id)){
					
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE[0]);
					$scope.lineOptions.push(features.DEFAULT.LINE[1]);
					$scope.lineSelection = $scope.lineOptions[1];
					$scope.operationSelection = $scope.operations[1].value ;
				}
			}
		//}
	}
	
	function updateFilters(){
	
		var filters = base.properties.filters ;
		var index ;

		$scope.filters = [] ;
		
		for(index in filters){
			
			if(filters[index].column.id != $scope.groupSelection.id){
				
				$scope.filters.push(filters[index]);
			}

		}
	
		base.controlFilters($scope.filters);
	}
}]);


function ComboChartFeatures(){
	
	// New features defaults
	this.DEFAULT = {
		get LINE(){
			return [{id : "no_line", text : "Não desenhar linha"},
					{id : "num_var", text: "Utilizar variáveis numéricas" }
				] ;
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
