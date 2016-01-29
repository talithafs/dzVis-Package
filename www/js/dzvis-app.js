application = angular.module("dzvis-app",["ui.router", "dzvis-services", "ngSanitize"]);

services = angular.module("dzvis-services", []);

application.config(function($stateProvider){
	
	$stateProvider.state("Google Combo Chart", {
		url: "",
		templateUrl: "views/combo-chart-template.html",
		controller: "GoogleComboChartController"
	});
	
	$stateProvider.state("Google Motion Chart", {
		url: "",
		templateUrl: "views/motion-chart-template.html",
		controller: "GoogleMotionChartController"
	});
	
});






