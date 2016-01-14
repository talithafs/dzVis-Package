var currentAttr, currentTable = undefined ;
var wholeTree = undefined ;

$(document).ready(function(){
	
	var DF_TEXT = $("#details-text").text() ;
	var DF_OPT = $('option:first', "#opt-nvalues").val() ;
	
	databaseTree.create('data/menu.json');
	
	var description = "" ;
	var viewMode = false ;
	var lastOpt = DF_OPT ;
	var done = false;

    $("#tree").click(function() {
		
		var instance = databaseTree.getInstance() ;
		var checked = instance.get_checked(true);
		var dim = checked.length ;
		var view = "" ;
		
		description = DF_TEXT ;		
		wholeTree = databaseTree.getSource();
		
		$("#view-option").hide();
		
		if(checked.length != 0){
			currentAttr = databaseTree.getCurrentAttr(checked);
			currentTable = databaseTree.getCurrentTable(currentAttr);
			
			description = "<h1>" + currentTable.text + "</h1>" + "<p>" + currentTable.description + "</p>" +
							"<h2>" + currentAttr.text + "</h2>" + "<p>" + currentAttr.description + "</p>" ; 
		
			view = "Ver Dados >>" ;
		}
		
		if(viewMode) viewMode = !viewMode ;
		
		$("#details-text").html(description) ;	
		$("#view-data").text(view);
		
	});
	
	$("#view-data").click(function() {
		
		viewMode = !viewMode ;
		
		if(viewMode) {
			
			$("#table").text(currentTable.text);
			$("#column").text(currentAttr.text);
			$("#view-option").show();
			
			getAttributeValues();
	 	}
	 	else { 
	 		$("#details-text").html(description) ;
	 		$("#view-data").text("Ver Dados >>") ;
	 		$("#opt-nvalues").val(DF_OPT);
	 		$("#view-option").hide();
	 	}
	 	
	});
	
	$("#opt-nvalues").change(function(){
		
		var currentOpt = $(this).val();
		
		if(currentOpt != lastOpt){
			getAttributeValues();
		}
		
		lastOpt = currentOpt ;
	});
	
	$('#search-field').keyup(function () {
	
	if(done) { clearTimeout(done); }
	
	done = setTimeout(function () {
	  	var value = $('#search-field').val();
	  	$('#tree').jstree(true).search(value);
	 }, 250);
	 
	});
	
	function getAttributeValues(){
		
		var nvalues = $("#opt-nvalues").val() ;
		
		$("#details-field").addClass('loading');
		$("#details-text").html("") ;
		$("#view-data").text("");
		
		window.setTimeout(function(){
	    	var req = ocpu.call("getAttributeValues", {
	    		attribute : currentAttr.id,
	    		table : currentTable.id,
	    		nvalues : nvalues
    		}, 
				function(session){
		        
		        session.getObject(function(filename){ 
		        	
		        	$.getJSON(session.getFileURL(filename), function(data) {
		        		
		        		$("#details-field").removeClass('loading');
		        		$("#details-text").html(data.values.join()) ;
		        		$("#view-data").text("<< Voltar") ;
		        	});
		        });
		        
     		});
    
		    req.fail(function(){
		      alert("Erro no servidor: " + req.responseText);
	    	});
	    	
	 	}, 0);
	}
	
	
	
	
});

/* probably should be placed in another file*/

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




