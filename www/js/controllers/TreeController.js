application.controller("TreeController",["$scope", "databasetree", function($scope, databaseTree){
	
	databaseTree.create('data/menu.json');

	$scope.treeClicked = function(){
		$scope.$parent.$broadcast("treeClicked", databaseTree.getInstance());
	} ;
}]);