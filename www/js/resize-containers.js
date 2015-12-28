var vPressed, mPressed = false;
var data, graphArea, tree, details, treePanel, detailsField = undefined;
var dataX, treeY, dataWidth, pAreaWidth, treeHeight, treePanelHeight, detailsFieldHeight, detailsHeight;
var onLeftBorder, onMiddleBorder = false;

$("#data").mousemove(function(e){
	/*e.offsetX < border_width - borda esquerda
	 *e.offsetX > $(this).innerWidth() - borda direita
	 *e.offsetY < border_width - borda superior
	 *e.offsetY > $(this).innerHeight() - borda inferior */
	
	if(e.offsetX > $(this).innerWidth()){
		$(this).addClass("on-vertical-border");
		onLeftBorder = true; 
	}
	else{
		$(this).removeClass("on-vertical-border");
		onLeftBorder = false ;
	}
});

$("#details").mousemove(function(e){
	var borderWidth = parseInt($(this).css('border-top-width'));
	
	if(e.offsetY < borderWidth){
		$(this).addClass("on-horizontal-border");
		onMiddleBorder = true; 
	}
	else{
		$(this).removeClass("on-horizontal-border");
		onMiddleBorder = false ;
	}
});

$("#data").mousedown(function(e) {
	
	if(onLeftBorder){
		data = $(this) ;
		graphArea = $("#graphingArea");
		vPressed = true;
		dataX = e.pageX;
		dataWidth = data.width();
		pAreaWidth = graphArea.width();
		data.addClass("no-selection");
		graphArea.addClass("no-selection");
	}
});

$("#details").mousedown(function(e) {
	
	if(onMiddleBorder){
		tree = $('#tree') ;
		treePanel = $(".tree-panel");
		details = $("#details");
		detailsField = $("#details-field");
		mPressed = true;
		treeY = e.pageY;
		detailsFieldHeight = detailsField.height();
		treeHeight = tree.height();
		treePanelHeight = treePanel.height();
		detailsHeight = details.height();
		tree.addClass("no-selection");
		details.addClass("no-selection");
	}
});

$(document).mousemove(function(e) {
	if(vPressed) {
		data.width(dataWidth+(e.pageX-dataX));
		graphArea.width(pAreaWidth - (e.pageX-dataX));
	}
	if(mPressed){
		tree.height(treeHeight + (e.pageY-treeY));
		treePanel.height(treePanelHeight + (e.pageY-treeY));
		details.height(detailsHeight - (e.pageY-treeY));
		detailsField.height(detailsFieldHeight - (e.pageY-treeY));
	}
});

$(document).mouseup(function() {
	if(vPressed) {
		graphArea.removeClass("no-selection");
		data.removeClass("no-selection");
		vPressed = false;
	}
	if(mPressed){
		tree.removeClass("no-selection");
		details.removeClass("no-selection");
		mPressed = false ;
	}
});

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
