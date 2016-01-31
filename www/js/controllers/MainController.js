application.controller("MainController",["$scope", "$document", "resizing", function($scope, $document, resizing){
	
	// Static headers
	$scope.databasesHeader = "[bases de dados]";
	$scope.detailsHeader = "[detalhes]" ;
	
	// Resizing events 
	$scope.dataOnMouseMove = resizing.dataOnMouseMove ;
	$scope.dataOnMouseDown = resizing.dataOnMouseDown ;
	$scope.detailsOnMouseMove = resizing.detailsOnMouseMove ;
	$scope.detailsOnMouseDown = resizing.detailsOnMouseDown ;
	$document.on('mousemove', resizing.documentOnMouseMove);
	$document.on('mouseup', resizing.documentOnMouseUp);
	
}]);
