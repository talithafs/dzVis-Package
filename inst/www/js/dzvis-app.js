application = angular.module("dzvis-app",["ui.router", "dzvis-services", "ngSanitize"]);

services = angular.module("dzvis-services", []);

application.config(function($stateProvider){
	
	$stateProvider.state("Default", {
		url: ""
	});
	
	$stateProvider.state("Google Combo Chart", {
		url: "",
		templateUrl: "views/google-combo-chart-template.html",
		controller: "GoogleComboChartController",
		data : {
			type : "googlevis"
		}
	});
	
	$stateProvider.state("Google Motion Chart", {
		url: "",
		templateUrl: "views/google-motion-chart-template.html",
		controller: "GoogleMotionChartController",
		data : {
			type : "googlevis"
		}
	});
	
	$stateProvider.state("Ggplot Geo Map", {
		url: "",
		templateUrl: "views/ggplot-geo-map-template.html",
		controller: "GgplotGeoMapController",
		data : {
			type : "ggplot"
		}
	});
	
});






