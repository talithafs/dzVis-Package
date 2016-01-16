application.controller("SearchController",["$scope", "$timeout", "pulldown", "databasetree", function($scope, $timeout, pulldown, databaseTree){
	
	$scope.searchHeader = "[busca]";
	$scope.imgClose = "img/arrow-up-small.png" ;
	$scope.imgOpen = "img/arrow-down-small.png" ;
	
	pulldown.setOpenImage($scope.imgOpen);
	pulldown.setCloseImage($scope.imgClose);
	$scope.pull = pulldown.move ;
	
	var searchOnKeyUp = function(text){
		
		$timeout(function(){
			databaseTree.getInstance().search(text);
		}, 250);
	} ;
	
	$scope.searchOnKeyUp = searchOnKeyUp ;
	
}]);