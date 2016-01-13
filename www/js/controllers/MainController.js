app.controller("MainController",["$scope", function($scope){
	
	// Static headers
	$scope.treeHeader = "[bases de dados]";
	$scope.detailsHeader = "[detalhes]" ;
	$scope.searchHeader = "[busca]";
	
	// Static text 
	$scope.detailsText = "Clique em uma tabela ou em alguma de suas colunas para obter detalhes de sua especificação." ;
	
	$scope.btnSearchClick = function() {
		alert("hi from the button");
		
	};

}]);