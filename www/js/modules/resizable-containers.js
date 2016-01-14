var resizableContainers = (function(){	
	
	var $data = $("#data") ;
	var $graphingArea = $("#graphingArea") ;
	var $tree = $("#tree") ;
	var $details = $("#details") ;
	var $treePanel = $(".tree-panel") ;
	var $detailsField = $("#details-field") ;

	var dataX, treeY, dataWidth, gAreaWidth, treeHeight, treePanelHeight, detailsFieldHeight, detailsHeight;

	var onLeftBorder, onMiddleBorder = false ;
	var vPressed, mPressed = false;

	var dataOnMouseMove = function(element){

		if(element.offsetX > $data.innerWidth()){
			$data.addClass("on-vertical-border");
			onLeftBorder = true; 
		}
		else{
			$data.removeClass("on-vertical-border");
			onLeftBorder = false ;
		}
	};

	var dataOnMouseDown = function(element){

		if(onLeftBorder){

			vPressed = true;
			dataX = element.pageX;
			dataWidth = $data.width();
			gAreaWidth = $graphingArea.width();
			$data.addClass("no-selection");
			$graphingArea.addClass("no-selection");
		}
	};

	var detailsOnMouseMove = function(element){

		var borderWidth = parseInt($details.css('border-top-width'));
	
		if(element.offsetY < borderWidth){
			$details.addClass("on-horizontal-border");
			onMiddleBorder = true; 
		}
		else{
			$details.removeClass("on-horizontal-border");
			onMiddleBorder = false ;
		}
	};

	var detailsOnMouseDown = function(e) {
	
		if(onMiddleBorder){
			
			mPressed = true;
			treeY = e.pageY;
			detailsFieldHeight = $detailsField.height();
			treeHeight = $tree.height();
			treePanelHeight = $treePanel.height();
			detailsHeight = $details.height();
			$tree.addClass("no-selection");
			$details.addClass("no-selection");
		}
	};

	var documentOnMouseMove = function(element){

		if(vPressed) {
			$data.width(dataWidth+(element.pageX-dataX));
			$graphingArea.width(gAreaWidth - (element.pageX-dataX));
		}
		if(mPressed){
			$tree.height(treeHeight + (element.pageY-treeY));
			$treePanel.height(treePanelHeight + (element.pageY-treeY));
			$details.height(detailsHeight - (element.pageY-treeY));
			$detailsField.height(detailsFieldHeight - (element.pageY-treeY));
		}
	};

	var documentOnMouseUp = function(element){

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
		$data : $data,
		$details : $details,
		dataOnMouseMove : dataOnMouseMove,
		dataOnMouseDown : dataOnMouseDown,
		detailsOnMouseMove : detailsOnMouseMove,
		detailsOnMouseDown : detailsOnMouseDown,
		documentOnMouseMove : documentOnMouseMove,
		documentOnMouseUp : documentOnMouseUp
	};
})();
