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
	$scope.lineOptions.push(features.DEFAULT.LINE[0]);
	$scope.lineSelection = $scope.lineOptions[0];
	
	$scope.operations = features.DEFAULT.OPERATIONS ;	
	$scope.operationSelection = { value : "-" };
	$scope.operationSelection.value = $scope.operations[0].value ;

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
    	
    	if($scope.timeVar.text != base.DEFAULT.TIME.text){
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
		 										height : 300 
				});
    		}
    		else {
    			$scope.$emit("chartError", sourceDataPath);
    		}    		
    	}; 

    	connection.createComboChart( table = base.properties.table.id,
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
		
		if($scope.operationSelection.value == $scope.operations[0].value){
			$scope.lineSelection = $scope.lineOptions[0] ;
		}
	};
	
	$scope.lineSelectionChanged = function(value){
		
		$scope.lineSelection = value ;
		
		if($scope.lineSelection == $scope.lineOptions[0]){
			$scope.operationSelection.value = $scope.operations[0].value ;
		}
		else if($scope.operationSelection.value == $scope.operations[0].value){
			$scope.operationSelection.value = $scope.operations[1].value ;
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
			$scope.operationSelection.value = $scope.operations[0].value;
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
				
				if($scope.lineSelection == $scope.lineOptions[0]){
					$scope.operationSelection.value = $scope.operations[0].value ;
				}
			}
			
			if($scope.targetSelection.length == 1 && $scope.targetSelection.text != base.DEFAULT.TARGET.text){
				$scope.lineOptions = [] ;
				$scope.lineOptions.push(features.DEFAULT.LINE[0]);
				$scope.lineOptions.push($scope.targetOptions[0]);
				$scope.lineSelection = $scope.lineOptions[1];
			}
		}
		else {		
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
					
					var target = jQuery.map($scope.lineOptions, function(obj){
						if(obj.id == $scope.targetSelection[0].id) return obj ;
					})[0];
					
					$scope.lineSelection = target ;
				}
			}
			else {
				if(opt == undefined || (opt != undefined && opt.id != features.DEFAULT.LINE[1].id)){
					
					$scope.lineOptions = [] ;
					$scope.lineOptions.push(features.DEFAULT.LINE[0]);
					$scope.lineOptions.push(features.DEFAULT.LINE[1]);
					$scope.lineSelection = $scope.lineOptions[1];
					$scope.operationSelection.value = $scope.operations[1].value ;
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
		validation.multipleDates = "" ;
		
		if($scope.multipleDatesMode){

			var results = $scope.$parent.checkDates($scope.multipleDates.split(","), 
									  				'dd-mm-yyyy', 
									  				$scope.lowerBound, 
									  				$scope.upperBound);
			if(typeof results == "string"){
				validation.message = results ;
			}
			
			validation.multipleDates = results ;
			return validation ;
		}
		else {
			
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
		}
		
		return validation ;
	}
	
	function getLineVar(){
		
		var noLine = features.DEFAULT.LINE[0].id ;
		var numVar = features.DEFAULT.LINE[1].id ;
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
			return [{id : "no_line", text : "Não desenhar linha"},
					{id : "num_var", text: "Utilizar variáveis numéricas"}
				] ;
		},
		get OPERATIONS(){
			return [
				{name: "Nenhuma", value: ""},
				{name: "Desvio Padrão", value: "Desvio padrao"},
				{name: "Média", value: "Media"}
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
