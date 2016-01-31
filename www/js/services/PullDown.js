services.service("pulldown", PullDown);

function PullDown() {

	var isOpen = false ;
	var imgOpen = "" ;
	var imgClose = "" ;

	var move = function(){
		
		var $searchBox = $("#search-box") ;
		var $tree = $("#tree");
		var $pullDown = $("#pull-down") ;
		var $treePanel = $(".tree-panel");
		
		var sHeight = $searchBox.outerHeight();
		var tHeight = $tree.innerHeight();
		var pHeight = $treePanel.height();

		isOpen = !isOpen ;
		
		if(isOpen){
			sHeight = -sHeight ;
			$pullDown.attr('src',imgClose);
		}
		else {
			$pullDown.attr('src',imgOpen);
		}
		
		$searchBox.slideToggle({duration: 'slow', queue: false});
		$tree.animate({ height: tHeight + sHeight, queue: false, duration: 'slow' }, 
					  { step: function() {
					  		// Prevent tree-panel height from changing 
					  		$treePanel.height(pHeight);
					  		// If text has overflown, set overflow-y to scroll while animating 
						  	if ($tree[0].scrollHeight >  $tree.innerHeight())
						  		$tree.css("overflow-y", "scroll"); }}
		);
		
	};
	
	var setOpenImage = function(imageSource) {
		imgOpen = imageSource ;
	};
	
	var setCloseImage = function(imageSource) {
		imgClose = imageSource ;
	};
	
	return {
		move : move,
		setOpenImage : setOpenImage,
		setCloseImage : setCloseImage 
	} ;
}