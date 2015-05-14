var args = arguments[0] || {};

// public init function
$.init = function(initargs){
	args = initargs;
	args.parentController.menubutton.addEventListener("click", function(e){
		if(e.source.toggle == true){
	        $.settingsview.animate({
	            left:-150,
	            duration:400,
	            curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	        });
	        e.source.toggle = false;
	    }
	    // If the menu isn't opened
	    else{
	        $.settingsview.animate({
	            left:0,
	            duration:400,
	            curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	        });
	        e.source.toggle  = true;
	    }
	});
};


(function(){
	
})();