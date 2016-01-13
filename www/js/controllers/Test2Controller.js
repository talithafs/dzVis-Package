app.controller("Test2Controller",["$scope", function($scope){
	
	$scope.message = "Hello from view TWO";
	$scope.treeValue = "None Yet";
	
	$scope.$on("selectionChanged", function(e, checked){
		
		$scope.$apply(function () {
			$scope.treeValue = "i got it, too";
		});
    });
	
}]);