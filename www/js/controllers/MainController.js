app.controller("MainController",["$scope", function($scope){
	
	// Static headers
	$scope.databasesHeader = "[bases de dados]";
	$scope.detailsHeader = "[detalhes]" ;
	$scope.searchHeader = "[busca]";
	
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

