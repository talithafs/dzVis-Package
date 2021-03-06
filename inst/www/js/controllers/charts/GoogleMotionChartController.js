/**
 * @fileOverview Definition of the GoogleMotionChartController controller. It manages the elements and the events associated with the Google Motion Chart form (template)
 * @author Talitha Speranza
 * @version 0.1
 */

/** @class 
 *	@name GoogleMotionChartController */
application.controller("GoogleMotionChartController", ["$scope", "$state", "googlecharts", function($scope, $state, base){
	
	var connection = $scope.$parent.connection ;
	
	// Google Charts labels
	$scope.targetVarLabel =  base.LABEL.TARGET;
	$scope.groupVarLabel = base.LABEL.GROUP ;
	$scope.timeVarLabel = base.LABEL.TIME ;
	$scope.filtersLabel = base.LABEL.FILTERS ;
	$scope.minLabel = base.LABEL.MIN_DATE ;
	$scope.maxLabel = base.LABEL.MAX_DATE ;
	
	// Google Charts default values
	$scope.targetOptions = [] ;
	$scope.targetOptions.push(base.DEFAULT.TARGET) ;
	
	$scope.groupOptions = [] ;
	$scope.groupOptions.push(base.DEFAULT.GROUP) ;
	
	$scope.timeVar = base.DEFAULT.TIME ;
	$scope.filters = [] ;
	
	// $scope.targetSelection = [] ;
	// $scope.targetSelection.push($scope.targetOptions[0]) ;	
	$scope.groupSelection = $scope.groupOptions[0] ;
	
	const noTarget = base.DEFAULT.TARGET.id ;
	const noGroup = base.DEFAULT.GROUP.id ;
	const noTime = base.DEFAULT.TIME.id ;
	
	var inputMax = angular.element(document.querySelector('#gmc-max-date'));
	var inputMin = angular.element(document.querySelector('#gmc-min-date'));

	/** 
	 * @private
	 * @function GoogleMotionChartController#$stateChangeSuccessListener
	 * @description Fills the form with currently select columns 
	 * @listens $stateChangeSuccess
	 * */	
	$scope.$on("$stateChangeSuccess", function(){
		
		base.onLoad(fillOptions);
	});
	
	/** 
	 * @private
	 * @function GoogleMotionChartController#nodeCheckedListener
	 * @description Fills the form with the last selected column
	 * @listens TreeController#nodeChecked
	 * */ 
	$scope.$on("nodeChecked", function(e, node){
		
		base.onNodeChecked(node, addOption) ;
	});
	
	/** 
	 * @private
	 * @function GoogleMotionChartController#nodeUncheckedListener
	 * @description Removes an unchecked column from the form
	 * @listens TreeController#nodeUnchecked
	 * */
	$scope.$on("nodeUnchecked", function(e, node){
		
		base.onNodeUnchecked(node, removeOption);
	});
	
	/** 
	 * @private
	 * @function GoogleMotionChartController#$destroyListener
	 * @description Handles the destruction of the form
	 * @listens $destroy
	 * */
	$scope.$on("$destroy", function(){
		
        base.onDestroy();
    });
    
    /** 
	 * @private
	 * @function GoogleMotionChartController#createChartListener
	 * @description Creates a Google Combo Chart
	 * @listens ChartsController#createChart
	 * @fires chartCreated
	 * @fires chartError
	 * */
    $scope.$on("createChart", function(){
    	
    	var validation = {} ;
    	validation.message = "Nenhum parâmetro foi escolhido." ;
    	
    	if($scope.timeVar.id != noTime){
    		validation = checkDates();
    	}
    	
    	var group = base.getGroupVar($scope.groupSelection);
    	
    	if(group == ""){
    		checkValidationMessage("As variáveis numéricas devem ser agrupadas.");
    	}
    	
    	if(!checkValidationMessage(validation.message)){ return ; }
		if(!checkValidationMessage(base.checkFilters($scope.filters))){ return ; }
    	
       // var target = base.getTargetVar($scope.targetSelection);
        var target = base.getTargetVar($scope.targetOptions);
        var time = base.getTimeVar($scope.timeVar);
        
        if(!checkValidationMessage(base.checkVariables(target, time))){ return ; }        
        
        var restrictions = base.getRestrictions($scope.filters);
        var alternatives = base.getAlternatives($scope.groupSelection);
        var min = validation.minDate ;
        var max = validation.maxDate ;
        
      	var callback = function(chartFilePath, sourceDataPath){
    		
    		if(chartFilePath != "ERROR"){
    			
    			/** 
		 		* Reports that a chart was created 
		 		* @event chartCreated
     	 		* @type {Object}
     	 		*/	
    			$scope.$emit("chartCreated", {  chartFilePath : chartFilePath,
		 										sourceDataPath : sourceDataPath,
		 										width : 730,
		 										height : 320
				});
    		}
    		else {
    			/** 
		 		* Reports that an error ocurred and the chart was not created
		 		* @event chartError
     	 		* @type {Object}
     	 		*/	
    			$scope.$emit("chartError", sourceDataPath);
    		}    		
    	}; 

    	connection.createGoogleMotionChart( table = base.properties.table.id,
    								        targetVar = target,
    								 	    groupVar = group,
    								 		timeVar = time,
    								 		min = min,
    								 		max = max,
    								 		restrictions = restrictions,
    								 		alternatives = alternatives,
    								 		callback = callback );
    });
    
    // $scope.targetSelectionChanged = function(value){
//     	
    	// $scope.targetSelection = value ;
//     	
    	// changeTarget();
    // };
    
    $scope.groupSelectionChanged = function(value){
//     	
		updateFilters() ;
    	// $scope.groupSelection = value ;
//     	
    	// changeGroup();	
    };

	
	function fillOptions(nodes){
		
		$scope.$apply(function(){
			setTimeParameters(base.properties.timeVariable);
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
				//$scope.targetSelection.push(node);
				
				if($scope.targetOptions.length != 1 && $scope.targetOptions[0].id == noTarget){
					$scope.targetOptions.splice(0,1);
				}
				
				//changeTarget();
			}
			else if(node.categories.GROUP === true){
				
				var group = jQuery.map($scope.groupOptions, function(obj){
								if(obj.id === node.id){ return obj ; } 
							})[0];
							
				if(group == undefined){
					
					if($scope.groupOptions[0].id == noGroup){
						$scope.groupOptions.splice(0,1);
					}
					
					$scope.groupOptions.push(node);
					$scope.groupSelection = node ;
				}
				else {
					$scope.groupSelection = group ;
				}
				
				//changeGroup();
			}
			
			updateFilters() ;
			setTimeParameters(base.properties.timeVariable);
		});
	}
	
	function removeOption(node){
		
		var index, dim, group ;
			
		$scope.$apply(function(){
			
			if(node.categories.TARGET === true){

				index = $scope.targetOptions.indexOf(node);
				$scope.targetOptions.splice(index,1);
				
				// index = $scope.targetSelection.indexOf(node);
				// $scope.targetSelection.splice(index,1);
				
				if($scope.targetOptions.length == 0){
					$scope.targetOptions = [] ;
					$scope.targetOptions.push(base.DEFAULT.TARGET) ;
				}
				
				// if($scope.targetSelection.length == 0){
					// dim = $scope.targetOptions.length ;
					// $scope.targetSelection.push($scope.targetOptions[dim-1]);
				// }
				
				//changeTarget(node);
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
								$scope.groupOptions.push(base.DEFAULT.GROUP) ;
								$scope.groupSelection = $scope.groupOptions[0] ;
							}
					}
				
					//changeGroup();
				}
				
				updateFilters();
			}

		});
	}
	
	
	// function changeTarget(node){
// 		
		// if($scope.targetSelection.length != 1){
// 	
			// if($scope.targetSelection[0].id === noTarget){
				// $scope.targetSelection.splice(0,1);
				// $scope.targetOptions.splice(0,1);
			// }
// 			
			// if($scope.groupSelection.id != noGroup){
				// $scope.groupSelection = $scope.groupOptions[0] ;
				// updateFilters();
			// }
		// }
		// else {			
			// var dim = $scope.groupOptions.length ;
			// var lastGroup = $scope.groupOptions[dim - 1] ;
// 			
			// $scope.groupSelection = lastGroup ;
			// updateFilters();
		// }
	// }
	
	// function changeGroup(){
// 		
		// if($scope.groupSelection != $scope.groupOptions[0]){
// 			
			// var dim = $scope.targetSelection.length ;
// 					
			// if(dim != 1){
				// var lastSelection = $scope.targetSelection[dim-1] ;
				// $scope.targetSelection = [] ;
				// $scope.targetSelection.push(lastSelection) ;
			// }
		// }
// 		
		// updateFilters();
	// }
	
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
		
		var frequency = base.properties.table.frequency ;
		var validation = { } ;
		var format = 'yyyy-mm' ;
		
		if(frequency == 'diaria'){
			format = 'yyyy-mm-dd' ;
		}
		
		validation.minDate = "" ;
		validation.maxDate = "" ;
		validation.message = "VALID" ;

		var results = $scope.$parent.checkDates([$scope.minDate, $scope.maxDate], 
								  				format, 
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
			
			var freq = base.properties.table.frequency ;
			
			$scope.timeVar = timeVar ;
			$scope.minDate = $scope.timeVar.minimum ;
			$scope.maxDate = $scope.timeVar.maximum ;
			$scope.upperBound = $scope.maxDate ;
			$scope.lowerBound = $scope.minDate ;

			if(freq == "diaria"){
				inputMax.attr('type',"date");
				inputMin.attr('type',"date");
			}
			else if(freq == "mensal"){
				inputMax.attr('type',"month");
				inputMin.attr('type',"month");
			}
		}
	}

	
}]);
