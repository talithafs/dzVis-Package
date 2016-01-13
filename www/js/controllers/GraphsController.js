app.controller("GraphsController",["$scope", function($scope){
	
	$("#tree").click(function(){
			$scope.$broadcast("selectionChanged", "Hello from the TREE!");
       }
	);

}]);
