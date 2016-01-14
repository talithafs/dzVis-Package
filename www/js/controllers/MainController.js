app.controller("MainController",["$scope", function($scope){
	
	// Static headers
	$scope.treeHeader = "[bases de dados]";
	$scope.detailsHeader = "[detalhes]" ;
	$scope.searchHeader = "[busca]";
	
	// Static text 
	$scope.detailsText = "Clique em uma tabela ou em alguma de suas colunas para obter detalhes de sua especificação." ;

	// Resizing logic	
	var $data = resizableContainers.$data ;
	var $details = resizableContainers.$details ;
	
	$data.mousedown(resizableContainers.dataOnMouseDown);
	$data.mousemove(resizableContainers.dataOnMouseMove);

	$details.mousedown(resizableContainers.detailsOnMouseDown);
	$details.mousemove(resizableContainers.detailsOnMouseMove);

	$(document).mousemove(resizableContainers.documentOnMouseMove);
	$(document).mouseup(resizableContainers.documentOnMouseUp);

}]);

