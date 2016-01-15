$(document).ready(function(){
	
	var done = false ;
	
	 	
	$('#search-field').keyup(function () {
	
	if(done) { clearTimeout(done); }
	
	done = setTimeout(function () {
	  	var value = $('#search-field').val();
	  	$('#tree').jstree(true).search(value);
	 }, 250);
	 
	});
});


$("#details-field").height($(".panel").height() - $("#tree-panel").height() - 2*$(".header").height());

var open = false ;

$("#pull-search").click(function(){
	var sHeight = $("#search-box").outerHeight();
	var tHeight = $("#tree").innerHeight();
	
	open = !open ;
	
	if(open){
		sHeight = -sHeight ;
		$("#pull-down").attr('src','img/arrow-up-small.png');
	}
	else {
		$("#pull-down").attr('src','img/arrow-down-small.png');
	}
	
	$("#search-box").slideToggle({duration: 'slow', queue: false});
	$("#tree").animate({height: tHeight + sHeight, queue: false});
});




