services.service("pulldown", PullDown);

function PullDown() {

	var isOpen = false ;
	var imgOpen = "" ;
	var imgClose = "" ;

	var move = function(){
		
		var $searchBox = $("#search-box") ;
		var $tree = $("#tree");
		var $pullDown = $("#pull-down") ;
		
		var sHeight = $searchBox.outerHeight();
		var tHeight = $tree.innerHeight();
		
		isOpen = !isOpen ;
		
		if(isOpen){
			sHeight = -sHeight ;
			$pullDown.attr('src',imgClose);
		}
		else {
			$pullDown.attr('src',imgOpen);
		}
		
		$searchBox.slideToggle({duration: 'slow', queue: false});
		$tree.animate({ height: tHeight + sHeight, queue: false }, 
					  { step: function() { 
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