application.controller("GraphsController",["$scope","connection", function($scope, connection){
	
	$scope.test = function(){
		
		var keys = [1,2,3];
		
		var callback = function(data){
			alert(data);
		} ;
		
		connection.validateKeys('',keys,'',callback);
		
	} ;

}]);
