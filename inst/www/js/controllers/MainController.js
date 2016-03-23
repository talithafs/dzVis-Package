application.controller("MainController",["$document", "resizing", function($document, resizing){
	
	// Static headers
	this.databasesHeader = "[bases de dados]";
	this.detailsHeader = "[detalhes]" ;
	
	// Resizing events 
	this.dataOnMouseMove = resizing.dataOnMouseMove ;
	this.dataOnMouseDown = resizing.dataOnMouseDown ;
	this.detailsOnMouseMove = resizing.detailsOnMouseMove ;
	this.detailsOnMouseDown = resizing.detailsOnMouseDown ;
	$document.on('mousemove', resizing.documentOnMouseMove);
	$document.on('mouseup', resizing.documentOnMouseUp);
	
}]);
