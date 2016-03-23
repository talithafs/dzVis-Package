services.service("pulldown", function(){
	return PullDown.getInstance();
});

var PullDown = (function() {
	
	//Single instance
	var instance ;
	
	// Private variables
	var isOpen = false ;
	var imgOpen = "" ;
	var imgClose = "" ;
	
	// Protected variables
	var properties = {
		get openImage() {
			return imgOpen ;
		},
		set openImage(source){
			imgOpen = source ;
		},
		get closeImage(){
			return imgClose ;
		},
		set closeImage(source){
			imgClose = source ;
		}
	};
	
	//Constructor 
	function PullDown(){}
	
	// Private function
	function createInstance() {
        var object = new PullDown();
        return object;
    }

	// Protected functions 
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
						  		$tree.css("overflow-y", "scroll");
					  }}
						  	
		);
		
	};
	
	//PullDown public API 
	PullDown.prototype.properties = properties ;
	
	PullDown.prototype.move = function(){
		move.call(this);
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