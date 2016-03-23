application.controller("SearchController",["$scope", "$timeout", "pulldown", "databasetree", function($scope, $timeout, pulldown, databaseTree){
	
	$scope.searchHeader = "[busca]";
	$scope.imgClose = "img/arrow-up-small.png" ;
	$scope.imgOpen = "img/arrow-down-small.png" ;
	
	pulldown.properties.openImage = $scope.imgOpen;
	pulldown.properties.closeImage = $scope.imgClose;
	$scope.pull = pulldown.move ;
	
	var searchOnKeyUp = function(text){
		
		$timeout(function(){
			databaseTree.search(text);
		}, 250);
	} ;
	
	$scope.searchOnKeyUp = searchOnKeyUp ;
	
}]);