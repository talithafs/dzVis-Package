services.service("resizing", Resizing);

function Resizing(){
	
	var $data = $("#data") ;
	var $graphingArea = $("#graphing-area") ;
	var $tree = $("#tree") ;
	var $details = $("#details") ;
	var $treePanel = $(".tree-panel") ;
	var $detailsField = $("#details-field") ;

	var dataX, treeY, dataWidth, gAreaWidth, treeHeight, treePanelHeight, detailsFieldHeight, detailsHeight;

	var onLeftBorder, onMiddleBorder = false ;
	var vPressed, mPressed = false;

	var dataOnMouseMove = function(event){

		if(event.offsetX > $data.innerWidth()){
			$data.addClass("on-vertical-border");
			onLeftBorder = true; 
		}
		else{
			$data.removeClass("on-vertical-border");
			onLeftBorder = false ;
		}
	};

	var dataOnMouseDown = function(event){

		if(onLeftBorder){

			vPressed = true;
			dataX = event.pageX;
			dataWidth = $data.width();
			gAreaWidth = $graphingArea.width();
			$data.addClass("no-selection");
			$graphingArea.addClass("no-selection");
		}
	};

	var detailsOnMouseMove = function(event){
	
		var borderWidth = parseInt($details.css('border-top-width'));
	
		if(event.offsetY < borderWidth){
			$details.addClass("on-horizontal-border");
			onMiddleBorder = true; 
		}
		else{
			$details.removeClass("on-horizontal-border");
			onMiddleBorder = false ;
		}
	};

	var detailsOnMouseDown = function(event) {
	
		if(onMiddleBorder){
			
			mPressed = true;
			treeY = event.pageY;
			detailsFieldHeight = $detailsField.height();
			treeHeight = $tree.height();
			treePanelHeight = $treePanel.height();
			detailsHeight = $details.height();
			$tree.addClass("no-selection");
			$details.addClass("no-selection");
		}
	};

	var documentOnMouseMove = function(event){

		if(vPressed) {
			$data.width(dataWidth+(event.pageX-dataX));
			$graphingArea.width(gAreaWidth - (event.pageX-dataX));
		}
		if(mPressed){
			$tree.height(treeHeight + (event.pageY-treeY));
			$treePanel.height(treePanelHeight + (event.pageY-treeY));
			$details.height(detailsHeight - (event.pageY-treeY));
			$detailsField.height(detailsFieldHeight - (event.pageY-treeY));
		}
	};

	var documentOnMouseUp = function(event){

		if(vPressed) {
			$graphingArea.removeClass("no-selection");
			$data.removeClass("no-selection");
			vPressed = false;
		}
		if(mPressed){
			$tree.removeClass("no-selection");
			$details.removeClass("no-selection");
			mPressed = false ;
		}
	};
	
	
	return {
		dataOnMouseMove : dataOnMouseMove,
		dataOnMouseDown : dataOnMouseDown,
		detailsOnMouseMove : detailsOnMouseMove,
		detailsOnMouseDown : detailsOnMouseDown,
		documentOnMouseMove : documentOnMouseMove,
		documentOnMouseUp : documentOnMouseUp
	};
}