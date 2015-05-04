var args = arguments[0] || {};

function doClickFavorites(e){
	Alloy.createController("favorites",{parent: $}).getView().open();
}

function doClickSettings(e){
	Alloy.createController("settings",{parent: $}).getView().open();
}

function doClickHistory(e){
	Alloy.createController("history",{parent: $}).getView().open();
}
