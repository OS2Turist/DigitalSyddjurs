var args = arguments[0] || {};

var open = false;

// public init function
$.init = function(initargs){
	args = initargs;
	args.parentController.menubutton.addEventListener("click", function(e){
		if(open){
	        closeMenu();
	    }
	    // If the menu isn't opened
	    else{
	    	openMenu();
	    }
	});
	/*
	args.parentController.win.addEventListener("swipe", function(e){
		if(e.direction === "right"){
			openMenu();
		}
	});
	*/
	$.settingsview.addEventListener("swipe", function(e){
		// handle swipe left on the settings
		if(e.direction === "left"){
			closeMenu();
		}
	});
};

function rowClicked(e){
	Alloy.Collections.Kategori.setSelected(e.row.katid, (1 - parseInt(e.row.hasCheck,10)));
	Alloy.Collections.Kategori.fetch();
}

function openMenu(){
	if(!open){
        $.settingsview.animate({
            left:0,
            duration:400,
            curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
        });
		open = true;
	}
}

function closeMenu(){
	if(open){
        $.settingsview.animate({
            left: 0 - $.settingsview.width,
            duration:400,
            curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
        });
		open = false;
	}
}

function languageFilter(collection) {
	var lan = Ti.Locale.currentLanguage;
	return collection.where({language: Ti.Locale.currentLanguage});
}

(function(){
	
	
})();