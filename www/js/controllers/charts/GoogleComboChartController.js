application.controller("GoogleComboChartController", [ "$scope", function($scope){
	
	var DEF_TARGET = [{id : null, text : "Nenhuma"}] ;
	var DEF_GROUP = [{id : null, text : "Não agrupar"}];
	var DEF_LINE = [{id : null, text : "Não desenhar linha"}] ;
	var DEF_TIME = {id : null, text : "Nenhuma"} ;
	
	var DEF_OPERATIONS = [
		{name: "Nenhuma", value: "none"},
		{name: "Desvio Padrão", value: "std"},
		{name: "Média", value: "mean"}
	];
	
	var LBL_MULTIPLE_DATES = "> Selecionar múltiplas datas" ;
	var LBL_INTERVAL = "< Selecionar intervalo" ;
	
	$scope.targetVarLabel = "Variáveis numéricas" ;
	$scope.groupVarLabel = "Agrupar por" ;
	$scope.timeVarLabel = "Variável temporal";
	$scope.lineVarLabel = "Desenhar linha com" ;
	$scope.operationLabel = "Operador" ;
	$scope.filtersLabel = "Filtros" ;
	$scope.minLabel = "Início:" ;
	$scope.maxLabel = "Fim:" ;
	$scope.placeholder = "Inserir datas no formato dd-mm-aaaa, separadas por vírgulas" ;
	
	$scope.selectMultipleDatesLabel = LBL_MULTIPLE_DATES ;
	$scope.targetOptions = DEF_TARGET ;
	$scope.groupOptions = DEF_GROUP ;
	$scope.lineOptions = DEF_LINE ;
	$scope.timeVar = DEF_TIME ;
	$scope.operations = DEF_OPERATIONS ;
	
	$scope.targetSelection = DEF_TARGET[0] ;
	$scope.groupSelection = DEF_GROUP[0];
	$scope.lineSelection = DEF_LINE[0];
	$scope.operationSelection = DEF_OPERATIONS[0].value ;
	
	 
	$scope.selectMultipleDates = function(){
		
		$scope.multipleDatesMode = !$scope.multipleDatesMode ;
		
		if($scope.multipleDatesMode){
			$scope.selectMultipleDatesLabel = LBL_INTERVAL ;
		}
		else {
			$scope.selectMultipleDatesLabel = LBL_MULTIPLE_DATES ;
		}
		
	};
	
	$scope.operationSelectionChanged = function(value){
		
		$scope.operationSelection = value ;
	};
	
	$scope.filters = [
		{column : "Abrangência", value : "Total das áreas"},
		{column : "Grupo de Idade", value : "20 a 30 anos"}
	];
}]);