services.factory('charts', ['$http', function($http) {
	
  return $http.get('data/charts.json')
         .success(function(data) {
         	
           for(index in data){
           		data[index].description = data[index].description.replace(/\n/g, "<br>");
           }
         	
           return data;
         })
         .error(function(data) {
           return data;
         });
}]);