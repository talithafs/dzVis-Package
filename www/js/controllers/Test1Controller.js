app.controller("Test1Controller",["$scope", function($scope){
	
	$scope.message = "Hello from view ONE";
	$scope.treeValue = "None Yet" ;
		
	$scope.$on("selectionChanged", function(e, checked){

		$scope.$apply(function () {
        	$scope.treeValue = checked ;
      	});
    });
	
}]);