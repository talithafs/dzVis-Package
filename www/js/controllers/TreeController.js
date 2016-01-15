app.controller("TreeController",["$scope", function($scope){
	
	databaseTree.create('data/menu.json');

	$scope.treeClicked = function(){
		$scope.$parent.$broadcast("treeClicked", databaseTree.getInstance());
	} ;
}]);