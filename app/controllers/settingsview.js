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
	
	args.parentController.win.addEventListener("swipe", function(e){
		if(e.direction === "right"){
			openMenu();
		}
	});
	
	$.settingsview.addEventListener("swipe", function(e){
		// handle swipe left on the settings
		if(e.direction === "left"){
			closeMenu();
		}
	});
};

function rowClicked(e){
	
	
	var res_kat = Alloy.Collections.Kategori.get(e.row.katid);
	
	Ti.API.info("Data found: " + JSON.stringify(res_kat));
	if(e.row.hasCheck){
		//e.row.hasCheck = 0;
		res_kat.set({
			selected: 0
		});
	}else{
		//e.row.hasCheck = 1;
		res_kat.set({
			selected: 1
		});
	}
	
	res_kat.save();
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
	// TODO remove this TEST fixture
	lan = "da";
	return collection.where({language: lan});
}

(function(){
	
})();