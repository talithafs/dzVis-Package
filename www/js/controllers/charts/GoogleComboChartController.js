application.controller("GoogleComboChartController", ["$scope", "$state", "googlecharts", function($scope, $state, base){
	
	var features = new ComboChartFeatures() ;
	var connection = $scope.$parent.connection ;
	
	// Google Charts labels
	$scope.targetVarLabel =  base.LABEL.TARGET;
	$scope.groupVarLabel = base.LABEL.GROUP ;
	$scope.timeVarLabel = base.LABEL.TIME ;
	$scope.filtersLabel = base.LABEL.FILTERS ;
	$scope.minLabel = base.LABEL.MIN_DATE ;
	$scope.maxLabel = base.LABEL.MAX_DATE ;
	$scope.placeholder = base.PLACEHOLDER.MULTIPLE_DATES.MONTHLY ;
	$scope.selectMultipleDatesLabel = base.LABEL.MULTIPLE_DATES ;
	
	// Google Charts default values
	$scope.targetOptions = [] ;
	$scope.targetOptions.push(base.DEFAULT.TARGET) ;
	
	$scope.groupOptions = [] ;
	$scope.groupOptions.push(base.DEFAULT.GROUP) ;
	
	$scope.timeVar = base.DEFAULT.TIME ;
	$scope.filters = [] ;
	
	$scope.targetSelection = [] ;
	$scope.targetSelection.push($scope.targetOptions[0]) ;	
	$scope.groupSelection = $scope.groupOptions[0] ;

	// New features
	$scope.lineVarLabel = features.LABEL.LINE ;
	$scope.operationLabel = features.LABEL.OPERATIONS ;
	
	$scope.lineOptions = [] ;
	$scope.lineOptions.push(features.DEFAULT.LINE.NO_LINE);
	$scope.lineSelection = $scope.lineOptions[0];
	
	$scope.operations = features.DEFAULT.OPERATIONS ;	
	$scope.operationSelection = { value : "-" };
	$scope.operationSelection.value = $scope.operations.ANONE.value ;
	
	const noTarget = base.DEFAULT.TARGET.id ;
	const noGroup = base.DEFAULT.GROUP.id ;
	const noTime = base.DEFAULT.TIME.id ;
	const noLine = features.DEFAULT.LINE.NO_LINE.id ;
	const numVar = features.DEFAULT.LINE.NUM_VAR.id ;
	const noOp = features.DEFAULT.OPERATIONS.ANONE.value ;
	
	var inputMax = angular.element(document.querySelector('#gcc-max-date'));
	var inputMin = angular.element(document.querySelector('#gcc-min-date'));				

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
    	
    	var validation = {} ;
    	validation.message = "Nenhum parâmetro foi escolhido." ;
    	
    	if($scope.timeVar.id != noTime){
    		validation = checkDates();
    	}
    	
    	if(!checkValidationMessage(validation.message)){ return ; }
		if(!checkValidationMessage(base.checkFilters($scope.filters))){ return ; }
    	
        var target = base.getTargetVar($scope.targetSelection);
        var group = base.getGroupVar($scope.groupSelection);
        var time = base.getTimeVar($scope.timeVar);
        
        if(!checkValidationMessage(base.checkVariables(target, time))){ return ; }        
        
        var restrictions = base.getRestrictions($scope.filters);
        var alternatives = base.getAlternatives($scope.groupSelection);
        var line = getLineVar();
        var operation = $scope.operationSelection.value ;
        var min = validation.minDate ;
        var max = validation.maxDate ;
        
        alternatives = getAlternatives(time, validation.multipleDates, alternatives) ;
        
      	var callback = function(chartFilePath, sourceDataPath){
    		
    		if(chartFilePath != "ERROR"){
    			$scope.$emit("chartCreated", {  chartFilePath : chartFilePath,
		 										sourceDataPath : sourceDataPath,
		 										width : 750,
		 										height : 320 
				});
    		}
    		else {
    			$scope.$emit("chartError", sourceDataPath);
    		}    		
    	}; 

    	connection.createGoogleComboChart( table = base.properties.table.id,
    								 	   targetVar = target,
    								 	   groupVar = group,
    								 	   timeVar = time,
    								 	   min = min,
    								 	   max = max,
    								 	   lineVar = line,
    								 	   operation = operation,
    								 	   restrictions = restrictions,
    								 	   alternatives = alternatives,
    								 	   callback = callback );
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
		
		if($scope.operationSelection.value == $scope.operations.ANONE.value){
			$scope.lineSelection = $scope.lineOptions[0] ;
		}
	};
	
	$scope.lineSelectionChanged = function(value){
		
		$scope.lineSelection = value ;
		
		if($scope.lineSelection == $scope.lineOptions[0]){
			$scope.operationSelection.value = $scope.operations.ANONE.value ;
		}
		else if($scope.operationSelection.value == $scope.operations.ANONE.value){
			$scope.operationSelection.value = $scope.operations.STD.value ;
		}
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
					$scope.targetOptions = [] ;
					$scope.targetOptions.push(base.DEFAULT.TARGET) ;
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
								$scope.groupSelection = [] ;
								$scope.groupSelection.push(base.DEFAULT.GROUP) ;
							}
					}
				
					changeGroup();
				}
			}

		});
	}
	
	
	function changeTarget(node){
		
		if($scope.targetSelection.length != 1){
	
			if($scope.targetSelection[0].id === noTarget){
				$scope.targetSelection.splice(0,1);
				$scope.targetOptions.splice(0,1);
			}
			
			if($scope.groupSelection != noGroup){
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
		
		changeLine(node);
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
			$scope.operationSelection.value = $scope.operations.ANONE.value;
		}
		
		updateFilters();
		changeLine();
	}
	
	function changeLine(node){
		
		if(node != undefined && node.state.checked == false){
			
			var index = $scope.lineOptions.indexOf(node);
			var dim = $scope.lineOptions.length - 1 ;
				
			if(index != -1){
				$scope.lineOptions.splice(index,1);				
				$scope.lineSelection = $scope.lineOptions[dim-1] ;
				
				if($scope.lineSelection.id == noLine){
					$scope.operationSelection.value = $scope.operations.ANONE.value ;
				}
			}
			
			if($scope.targetSelection.length == 1 && $scope.targetSelection[0].id != noTarget){
				$scope.lineOptions = [] ;
				$scope.lineOptions.push(features.DEFAULT.LINE.NO_LINE);
				$scope.lineOptions.push($scope.targetOptions[0]);
				$scope.lineSelection = $scope.lineOptions[1];
			}
		}
		else {		
			var opt = $scope.lineOptions[1] ;
			
			if($scope.targetSelection[0].id == noTarget){
				
				if($scope.lineOptions.length != 1){
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE.NO_LINE);
					$scope.lineSelection = $scope.lineOptions[0];
 				}
			}
			else if($scope.targetSelection.length == 1){
				
				if(opt == undefined || (opt != undefined && opt.id == numVar)){
					
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE.NO_LINE);
					
					for(index in $scope.targetOptions){
						$scope.lineOptions.push($scope.targetOptions[index]);
					}
					
					var target = jQuery.map($scope.lineOptions, function(obj){
						if(obj.id == $scope.targetSelection[0].id) return obj ;
					})[0];
					
					$scope.lineSelection = target ;
				}
			}
			else {
				if(opt == undefined || (opt != undefined && opt.id != numVar)){
					
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE.NO_LINE);
					$scope.lineOptions.push(features.DEFAULT.LINE.NUM_VAR);
					$scope.lineSelection = $scope.lineOptions[1];
					$scope.operationSelection.value = $scope.operations.STD.value ;
				}
			}
		}
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
			
			if(freq == "diaria"){
				$scope.placeholder = base.PLACEHOLDER.MULTIPLE_DATES.DAILY ;
			}
			else if(freq == "mensal") {
				$scope.placeholder = base.PLACEHOLDER.MULTIPLE_DATES.MONTHLY ;
			}
			else {
				$scope.placeholder = base.PLACEHOLDER.MULTIPLE_DATES.YEARLY ;
			}
		}
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
		var frequency = base.properties.table.frequency ;
		var format = "" ;
		
		validation.minDate = "" ;
		validation.maxDate = "" ;
		validation.message = "VALID" ;
		validation.multipleDates = "" ;
		
		if($scope.multipleDatesMode){
			
			format = "mm-yyyy" ;
			
			if(frequency == "diaria"){
				format = "dd-mm-yyyy" ;
			}

			var results = $scope.$parent.checkDates($scope.multipleDates.split(","), 
									  				format, 
									  				$scope.lowerBound, 
									  				$scope.upperBound);
			if(typeof results == "string"){
				validation.message = results ;
			}
			
			validation.multipleDates = results ;
			return validation ;
		}
		else {
			
			format = "yyyy-mm" ;
			
			if(frequency == "diaria"){
				format = "yyyy-mm-dd" ;
			}
			
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
		}
		
		return validation ;
	}
	
	function getLineVar(){
		
		var lineVar = $scope.lineSelection ;
		
		if(lineVar == undefined || lineVar.id == noLine || lineVar.id == numVar){
			return "" ;
		}
		
		return lineVar.original.name ;
	}
	
	function getAlternatives(timeVarName, multipleDates, alternatives){
		
		if($scope.multipleDatesMode){
			
			for(index in multipleDates){
				alternatives.push([timeVarName, multipleDates[index]]);
			}
		}
		
		return alternatives ;
	}
}]);


function ComboChartFeatures(){
	
	// New features defaults
	this.DEFAULT = {
		get LINE(){
			return {
					NO_LINE : {id : "no_line", text : "Não desenhar linha"},
					NUM_VAR : {id : "num_var", text: "Utilizar variáveis numéricas"}
				} ;
		},
		get OPERATIONS(){
			return {
				ANONE: {name: "Nenhum", value: ""},
				STD: {name: "Desvio Padrão", value: "Desvio padrao"},
				AVG: {name: "Média", value: "Media"}
			};
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
