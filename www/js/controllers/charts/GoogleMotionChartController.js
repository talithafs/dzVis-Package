application.controller("GoogleMotionChartController", ["$scope", "$state", "googlecharts", "connection", function($scope, $state, base, connection){
	
	var features = new ComboChartFeatures() ;
	
	// Google Charts labels
	$scope.targetVarLabel =  base.LABEL.TARGET;
	$scope.groupVarLabel = base.LABEL.GROUP ;
	$scope.timeVarLabel = base.LABEL.TIME ;
	$scope.filtersLabel = base.LABEL.FILTERS ;
	$scope.minLabel = base.LABEL.MIN_DATE ;
	$scope.maxLabel = base.LABEL.MAX_DATE ;
	
	// Google Charts default values
	$scope.targetOptions = base.DEFAULT.TARGET ;
	$scope.groupOptions = base.DEFAULT.GROUP ;
	$scope.timeVar = base.DEFAULT.TIME ;
	$scope.filters = [] ;
	
	$scope.targetSelection = [] ;
	$scope.targetSelection.push($scope.targetOptions[0]) ;	
	$scope.groupSelection = $scope.groupOptions[0] ;

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
    	
    	// var validation = {} ;
    	// validation.message = "Nenhum parâmetro foi escolhido." ;
//     	
    	// if($scope.timeVar.text != base.DEFAULT.TIME.text){
    		// validation = checkDates();
    	// }
//     	
    	// if(!checkValidationMessage(validation.message)){ return ; }
		// if(!checkValidationMessage(base.checkFilters($scope.filters))){ return ; }
//     	
        // var target = base.getTargetVar($scope.targetSelection);
        // var group = base.getGroupVar($scope.groupSelection);
        // var time = base.getTimeVar($scope.timeVar);
//         
        // if(!checkValidationMessage(base.checkVariables(target, time))){ return ; }        
//         
        // var restrictions = base.getRestrictions($scope.filters);
        // var alternatives = base.getAlternatives($scope.groupSelection);
        // var min = validation.minDate ;
        // var max = validation.maxDate ;
//         
      	// var callback = function(chartFilePath, sourceDataPath){
//     		
    		// if(chartFilePath != "ERROR"){
    			// $scope.$emit("chartCreated", {  chartFilePath : chartFilePath,
		 										// sourceDataPath : sourceDataPath,
		 										// width : 750,
		 										// height : 300 
				// });
    		// }
    		// else {
    			// $scope.$emit("chartError", sourceDataPath);
    		// }    		
    	// }; 
// 
    	// connection.createComboChart( table = base.properties.table.id,
    								 // targetVar = target,
    								 // groupVar = group,
    								 // timeVar = time,
    								 // min = min,
    								 // max = max,
    								 // lineVar = line,
    								 // operation = operation,
    								 // restrictions = restrictions,
    								 // alternatives = alternatives,
    								 // callback = callback );
    								 
    	
    		//alert($scope.maxDate);
    });
    
    $scope.targetSelectionChanged = function(value){
    	
    	$scope.targetSelection = value ;
    	
    	changeTarget();
    };
    
    $scope.groupSelectionChanged = function(value){
    	
    	$scope.groupSelection = value ;
    	
    	changeGroup();	
    };

	
	function fillOptions(nodes, timeVar){
		
		$scope.$apply(function(){
			setTimeParameters(timeVar);
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
				$scope.targetSelection.push(node);
				
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
			
			setTimeParameters(base.properties.timeVariable);
		});
	}
	
	function removeOption(node){
		
		var index, dim, group ;
			
		$scope.$apply(function(){
			
			if(node.categories.TARGET === true){

				index = $scope.targetOptions.indexOf(node);
				$scope.targetOptions.splice(index,1);
				
				index = $scope.targetSelection.indexOf(node);
				$scope.targetSelection.splice(index,1);
				
				if($scope.targetOptions.length == 0){
					$scope.targetOptions = base.DEFAULT.TARGET ;
				}
				
				if($scope.targetSelection.length == 0){
					dim = $scope.targetOptions.length ;
					$scope.targetSelection.push($scope.targetOptions[dim-1]);
				}
				
				changeTarget(node);
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
	
	
	function changeTarget(node){
		
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
		
		updateFilters();
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
	
	function checkValidationMessage(message){
		
		if(message != "VALID"){
    		$scope.$emit("chartError", message);
    		return false ;
    	}
    	
    	return true ;
	}
	
	function checkDates(){
		
		var validation = { } ;
		validation.minDate = "" ;
		validation.maxDate = "" ;
		validation.message = "VALID" ;

		var results = $scope.$parent.checkDates([$scope.minDate, $scope.maxDate], 
								  				'yyyy-mm-dd', 
								  				$scope.lowerBound, 
								  				$scope.upperBound);
		if(typeof results == "string"){
			validation.message = results ;
			
		}
		else {
			validation.minDate = results[0] ;
			validation.maxDate = results[1] ;
		}

		return validation ;
	}
	
	function setTimeParameters(timeVar){
		
		if($scope.timeVar.id != timeVar.id){
			
			$scope.timeVar = timeVar ;
			$scope.minDate = $scope.timeVar.minimum ;
			$scope.maxDate = $scope.timeVar.maximum ;
			$scope.upperBound = $scope.maxDate ;
			$scope.lowerBound = $scope.minDate ;

			
			if(base.properties.table.original.frequency == "diaria"){
				var max = angular.element(document.querySelector('#gmc-max-date'));
				max.attr('type',"date");
				
				var min = angular.element(document.querySelector('#gmc-min-date'));
				min.attr('type',"date");
			}
			else if(freq == "mensal"){
				var max = angular.element(document.querySelector('#gmc-max-date'));
				max.attr('type',"month");
				
				var min = angular.element(document.querySelector('#gmc-min-date'));
				min.attr('type',"month");
			}
		}
	}

	
}]);
