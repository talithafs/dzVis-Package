services.service("resizing", function(){ 
	return Resizing.getInstance() ;
});

var Resizing = (function(){
	
	// Single instance
	var instance ;
	
	// Private variables
	var $data = $("#data") ;
	var $chartingArea = $("#charting-area") ;
	var $tree = $("#tree") ;
	var $details = $("#details") ;
	var $treePanel = $(".tree-panel") ;
	var $detailsField = $("#details-field") ;

	var dataX, treeY, dataWidth, gAreaWidth, treeHeight, treePanelHeight, detailsFieldHeight, detailsHeight;

	var onLeftBorder, onMiddleBorder = false ;
	var vPressed, mPressed = false;
	
	// Constuctor
	function Resizing(){ }
	
	// Private function
	function createInstance() {
        var object = new Resizing();
        return object;
    }

	// Protected functions
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
			gAreaWidth = $chartingArea.width();
			$data.addClass("no-selection");
			$chartingArea.addClass("no-selection");
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
			$chartingArea.width(gAreaWidth - (event.pageX-dataX));
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
			$chartingArea.removeClass("no-selection");
			$data.removeClass("no-selection");
			vPressed = false;
		}
		if(mPressed){
			$tree.removeClass("no-selection");
			$details.removeClass("no-selection");
			mPressed = false ;
		}
	};
	
	// Resizing public API
	Resizing.prototype.dataOnMouseMove = function(event){
		dataOnMouseMove.call(this,event);
	};
	
	Resizing.prototype.dataOnMouseDown = function(event){
		dataOnMouseDown.call(this,event);
	};
	
	Resizing.prototype.detailsOnMouseMove = function(event){
		detailsOnMouseMove.call(this,event);
	};
	
	Resizing.prototype.detailsOnMouseDown = function(event){
		detailsOnMouseDown.call(this,event);
	};
	
	Resizing.prototype.documentOnMouseMove = function(event){
		documentOnMouseMove.call(this,event);
	};
	
	Resizing.prototype.documentOnMouseUp = function(event){
		documentOnMouseUp.call(this,event);
	};
	
	return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}());