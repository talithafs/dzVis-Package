application.controller("TreeController",["$scope", "databasetree", function($scope, databaseTree){
	
	//rodar o script de criacao do menu.json ? 
	
	databaseTree.create('data/menu.json');

	$scope.treeClicked = function(){
		$scope.$parent.$broadcast("treeClicked", databaseTree.getInstance());
	} ;
}]);